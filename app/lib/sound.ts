/* ---------------------------------------------------------------------------
   One quiet instrument for the whole site.

   A single shared AudioContext, master chain and soft convolution space, plus
   ONE C-major pentatonic scale, so every interaction belongs to the same
   sonic identity and several notes triggered close together still harmonise.
   Micro-variation (a few cents of detune, small gain/timing jitter) keeps
   repeats from feeling mechanical; a voice limiter + cooldowns keep overlaps
   quiet and calm.

   Materials, all from the same family:
     • shell      — the oyster on Home: pearl / shell / shoreline.
     • shell-echo — the smaller oyster on Contact: the same shell, quieter and
       more intimate (hover "two shells touching" + position-based resonances).
     • shell-bloom— clicking the Contact oyster: a deeper warm resonance with a
       short restrained bowl-like tail and a distant-water wash.
     • wood       — Selected Works: warm wood / canvas / gallery contact.
     • air        — Artist Statement: paper / breath / delicate tonal ambience.

   Muted until the first interaction (autoplay-safe); silent while hidden.
--------------------------------------------------------------------------- */

// C-major pentatonic — the shared scale. Wood plays an octave lower (warmer).
const SHELL_NOTES = [
  261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99,
];
const WOOD_NOTES = [
  130.81, 146.83, 164.81, 196.0, 220.0, 246.94, 261.63, 293.66,
];

const MASTER_GAIN = 0.5;
const REVERB_WET = 0.14;
const COOLDOWN_MS = 200; // per-source re-trigger guard
const MIN_GAP_MS = 40; // global spacing so notes never stack loudly
const MAX_VOICES = 5; // limit simultaneous layers

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let noise: AudioBuffer | null = null;
let enabled = false;
let primed = false;
let activeVoices = 0;
const lastPlayed: Record<string, number> = {};
let lastAny = 0;

// A few cents of detune + small gain jitter so repeats never feel mechanical.
const detune = (f: number) => f * (1 + (Math.random() * 2 - 1) * 0.004);
const jitter = (base: number, amt = 0.12) =>
  base * (1 - amt + Math.random() * amt * 2);

function makeImpulse(c: AudioContext, seconds: number, decay: number): AudioBuffer {
  const len = Math.floor(c.sampleRate * seconds);
  const buffer = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buffer;
}

function getNoise(c: AudioContext): AudioBuffer {
  if (!noise) {
    const len = Math.floor(c.sampleRate * 0.6);
    noise = c.createBuffer(1, len, c.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  return noise;
}

function onVisibility() {
  if (!ctx) return;
  if (document.hidden) ctx.suspend().catch(() => {});
  else if (enabled) ctx.resume().catch(() => {});
}

function ensureContext(): AudioContext | null {
  if (ctx) return ctx;
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();

  master = ctx.createGain();
  master.gain.value = MASTER_GAIN;

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -6;
  comp.knee.value = 18;
  comp.ratio.value = 3;
  comp.attack.value = 0.003;
  comp.release.value = 0.25;
  master.connect(comp);
  comp.connect(ctx.destination);

  reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx, 1.7, 2.6);
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = REVERB_WET;
  reverb.connect(reverbGain);
  reverbGain.connect(master);

  document.addEventListener("visibilitychange", onVisibility);
  return ctx;
}

/** Auto-enable on the visitor's first interaction (no button, autoplay-safe). */
export function primeSound(): void {
  if (primed || typeof window === "undefined") return;
  primed = true;
  const EVENTS = ["pointerdown", "touchstart", "mousedown", "keydown"];
  const start = () => {
    enabled = true;
    const c = ensureContext();
    if (c) c.resume().catch(() => {});
    EVENTS.forEach((e) => window.removeEventListener(e, start, true));
  };
  EVENTS.forEach((e) =>
    window.addEventListener(e, start, { capture: true, passive: true })
  );
}

// Shared gate: enabled + visible + within polyphony + cooldown. Returns ctx.
function gate(key: string): AudioContext | null {
  if (!enabled) return null;
  if (typeof document !== "undefined" && document.hidden) return null;
  const c = ensureContext();
  if (!c || !master) return null;
  if (c.state === "suspended") c.resume().catch(() => {});
  if (activeVoices >= MAX_VOICES) return null;
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  if (now - (lastPlayed[key] || 0) < COOLDOWN_MS) return null;
  if (now - lastAny < MIN_GAP_MS) return null;
  lastPlayed[key] = now;
  lastAny = now;
  return c;
}

// Count the voice while it sounds, and tear it down cleanly when it ends.
function voiceEnd(fundamental: AudioScheduledSourceNode, nodes: AudioNode[]) {
  activeVoices += 1;
  fundamental.onended = () => {
    activeVoices = Math.max(0, activeVoices - 1);
    nodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        /* gone */
      }
    });
  };
}

/** Oyster voice — pearl / shell / shoreline (Home). */
export function playShell(index: number): void {
  const c = gate("shell" + index);
  if (!c || !master) return;
  const t = c.currentTime;
  const freq = detune(SHELL_NOTES[index] ?? SHELL_NOTES[SHELL_NOTES.length - 1]);
  const peak = jitter(0.85);

  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(peak, t + 0.012);
  env.gain.exponentialRampToValueAtTime(peak * 0.4, t + 0.16);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);

  const warmth = c.createBiquadFilter();
  warmth.type = "lowpass";
  warmth.frequency.value = 4200;
  warmth.Q.value = 0.6;
  env.connect(warmth);
  warmth.connect(master);
  if (reverb) warmth.connect(reverb);

  const nodes: AudioNode[] = [env, warmth];
  const partial = (mult: number, level: number, type: OscillatorType = "sine") => {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = freq * mult;
    const g = c.createGain();
    g.gain.value = level;
    o.connect(g);
    g.connect(env);
    o.start(t);
    o.stop(t + 1.0);
    nodes.push(o, g);
    return o;
  };
  const body = partial(1, 1);
  partial(2.76, 0.1); // inharmonic pearl
  partial(5.4, 0.035); // faint glassy sparkle

  const nz = c.createBufferSource();
  nz.buffer = getNoise(c);
  const air = c.createBiquadFilter();
  air.type = "bandpass";
  air.frequency.value = freq * 4;
  air.Q.value = 1.2;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.linearRampToValueAtTime(0.05, t + 0.01);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  nz.connect(air);
  air.connect(ng);
  ng.connect(master);
  if (reverb) ng.connect(reverb);
  nz.start(t);
  nz.stop(t + 0.25);
  nodes.push(nz, air, ng);

  voiceEnd(body, nodes);
}

/** Contact oyster — the same shell, quieter and more intimate. Hover = "two
    small shells touching"; cursor position selects the note (movement layer). */
export function playShellEcho(index: number): void {
  const c = gate("echo" + index);
  if (!c || !master) return;
  const t = c.currentTime;
  const base = SHELL_NOTES[((index % SHELL_NOTES.length) + SHELL_NOTES.length) % SHELL_NOTES.length];
  const freq = detune(base);
  const peak = jitter(0.4); // markedly softer than Home

  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(peak, t + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

  const warmth = c.createBiquadFilter();
  warmth.type = "lowpass";
  warmth.frequency.value = 3200;
  warmth.Q.value = 0.5;
  env.connect(warmth);
  warmth.connect(master);
  const wet = c.createGain();
  wet.gain.value = 1.4; // more space — distant, intimate
  if (reverb) {
    warmth.connect(wet);
    wet.connect(reverb);
  }

  const nodes: AudioNode[] = [env, warmth, wet];
  const partial = (mult: number, level: number) => {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = freq * mult;
    const g = c.createGain();
    g.gain.value = level;
    o.connect(g);
    g.connect(env);
    o.start(t);
    o.stop(t + 0.65);
    nodes.push(o, g);
    return o;
  };
  const body = partial(1, 1);
  partial(3.01, 0.05); // faint pearl

  // a very short, high, soft tick — two small shells touching
  const nz = c.createBufferSource();
  nz.buffer = getNoise(c);
  const tick = c.createBiquadFilter();
  tick.type = "bandpass";
  tick.frequency.value = detune(base * 6);
  tick.Q.value = 3;
  const tg = c.createGain();
  tg.gain.setValueAtTime(0.04, t);
  tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
  nz.connect(tick);
  tick.connect(tg);
  tg.connect(master);
  nz.start(t);
  nz.stop(t + 0.04);
  nodes.push(nz, tick, tg);

  voiceEnd(body, nodes);
}

/** Contact oyster click — a deeper, warmer shell resonance with a short,
    restrained bowl-like tail and a distant-water wash. */
export function playShellBloom(index: number): void {
  const c = gate("bloom");
  if (!c || !master) return;
  const t = c.currentTime;
  const base = SHELL_NOTES[Math.min(2, Math.abs(index) % 3)]; // low, warm
  const freq = detune(base);

  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(0.5, t + 0.03);
  env.gain.exponentialRampToValueAtTime(0.18, t + 0.4);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 1.3); // short, restrained tail

  const warmth = c.createBiquadFilter();
  warmth.type = "lowpass";
  warmth.frequency.value = 2200;
  warmth.Q.value = 0.6;
  env.connect(warmth);
  warmth.connect(master);
  const wet = c.createGain();
  wet.gain.value = 1.2;
  if (reverb) {
    warmth.connect(wet);
    wet.connect(reverb);
  }

  const nodes: AudioNode[] = [env, warmth, wet];
  const partial = (mult: number, level: number) => {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = freq * mult;
    const g = c.createGain();
    g.gain.value = level;
    o.connect(g);
    g.connect(env);
    o.start(t);
    o.stop(t + 1.4);
    nodes.push(o, g);
    return o;
  };
  const body = partial(1, 1);
  partial(2.004, 0.18); // gentle beating — bowl-like, never metallic
  partial(3.02, 0.06);

  // distant water / marine wash
  const nz = c.createBufferSource();
  nz.buffer = getNoise(c);
  nz.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 700;
  lp.Q.value = 0.4;
  const wg = c.createGain();
  wg.gain.setValueAtTime(0.0001, t);
  wg.gain.linearRampToValueAtTime(0.05, t + 0.25);
  wg.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
  nz.connect(lp);
  lp.connect(wg);
  wg.connect(master);
  if (reverb) wg.connect(reverb);
  nz.start(t);
  nz.stop(t + 1.05);
  nodes.push(nz, lp, wg);

  voiceEnd(body, nodes);
}

/** Selected Works voice — wood / canvas / gallery. */
export function playWood(index: number): void {
  const c = gate("wood" + index);
  if (!c || !master) return;
  const t = c.currentTime;
  const freq = detune(WOOD_NOTES[index % WOOD_NOTES.length]);

  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(jitter(0.9), t + 0.006);
  env.gain.exponentialRampToValueAtTime(0.36, t + 0.13);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

  const warmth = c.createBiquadFilter();
  warmth.type = "lowpass";
  warmth.frequency.value = 2600;
  warmth.Q.value = 0.7;
  env.connect(warmth);
  warmth.connect(master);
  if (reverb) warmth.connect(reverb);

  const nodes: AudioNode[] = [env, warmth];
  const part = (mult: number, level: number, type: OscillatorType) => {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = freq * mult;
    const g = c.createGain();
    g.gain.value = level;
    o.connect(g);
    g.connect(env);
    o.start(t);
    o.stop(t + 0.75);
    nodes.push(o, g);
    return o;
  };
  const body = part(1, 0.85, "triangle");
  part(2.01, 0.14, "sine");

  const nz = c.createBufferSource();
  nz.buffer = getNoise(c);
  const tap = c.createBiquadFilter();
  tap.type = "bandpass";
  tap.frequency.value = 1600;
  tap.Q.value = 0.8;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.12, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  nz.connect(tap);
  tap.connect(ng);
  ng.connect(master);
  nz.start(t);
  nz.stop(t + 0.06);
  nodes.push(nz, tap, ng);

  voiceEnd(body, nodes);
}

/** Artist Statement voice — air / paper / quiet breath + a delicate tone. */
export function playAir(index: number): void {
  const c = gate("air" + index);
  if (!c || !master) return;
  const t = c.currentTime;
  const freq = detune(SHELL_NOTES[(index + 4) % SHELL_NOTES.length]);
  const nodes: AudioNode[] = [];

  // paper / breath — a soft band of moving air
  const nz = c.createBufferSource();
  nz.buffer = getNoise(c);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2400;
  bp.Q.value = 0.8;
  const bg = c.createGain();
  bg.gain.setValueAtTime(0.0001, t);
  bg.gain.linearRampToValueAtTime(0.035, t + 0.06);
  bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
  nz.connect(bp);
  bp.connect(bg);
  bg.connect(master);
  if (reverb) bg.connect(reverb);
  nz.start(t);
  nz.stop(t + 0.45);
  nodes.push(nz, bp, bg);

  // a delicate high tone
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(jitter(0.18), t + 0.03);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  env.connect(master);
  if (reverb) env.connect(reverb);
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.value = freq;
  o.connect(env);
  o.start(t);
  o.stop(t + 0.55);
  nodes.push(env, o);

  voiceEnd(o, nodes);
}
