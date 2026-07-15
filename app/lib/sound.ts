/* ---------------------------------------------------------------------------
   One sound language for the whole site.

   A single shared AudioContext, master chain and soft convolution space, plus
   a common pentatonic scale, so every interaction belongs to the same family.
   Two "materials" share that core:

     • shell  — the oyster (Home): pearl / shell / shoreline. A rounded sine
       body with faint inharmonic "pearl" partials and a whisper of filtered
       noise (sea air), warmed by a gentle low-pass. Airy and resonant.

     • wood   — Selected Works: wood / canvas / gallery. A warm low triangle
       body with a short band-passed noise "tap" (finger on wood/canvas),
       drier and lower than the shell. Tactile and grounded.

   Both are quiet, refined and premium — no ocean recordings, no clichés.
   Muted until the visitor's first interaction (autoplay-safe); silent while
   the tab is hidden.
--------------------------------------------------------------------------- */

// C-major pentatonic. Shell rings play the upper register; wood plays an
// octave lower (warmer) — same notes, same harmony, different material.
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

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let noise: AudioBuffer | null = null;
let enabled = false;
let primed = false;
const lastPlayed: Record<string, number> = {};
let lastAny = 0;

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
    const len = Math.floor(c.sampleRate * 0.5);
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

  // Shared soft space — a calm room / shoreline air (no literal ocean).
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

// Shared gate: enabled + visible + cooldown. Returns the context or null.
function gate(key: string): AudioContext | null {
  if (!enabled) return null;
  if (typeof document !== "undefined" && document.hidden) return null;
  const c = ensureContext();
  if (!c || !master) return null;
  if (c.state === "suspended") c.resume().catch(() => {});
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  if (now - (lastPlayed[key] || 0) < COOLDOWN_MS) return null;
  if (now - lastAny < MIN_GAP_MS) return null;
  lastPlayed[key] = now;
  lastAny = now;
  return c;
}

/** Oyster voice — pearl / shell / shoreline. `index` selects the ring's note. */
export function playShell(index: number): void {
  const c = gate("shell" + index);
  if (!c || !master) return;
  const t = c.currentTime;
  const freq = SHELL_NOTES[index] ?? SHELL_NOTES[SHELL_NOTES.length - 1];

  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(0.85, t + 0.012);
  env.gain.exponentialRampToValueAtTime(0.85 * 0.4, t + 0.16);
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
  const body = partial(1, 1); //        rounded shell body
  partial(2.76, 0.1); //                inharmonic pearl partial
  partial(5.4, 0.035); //               faint glassy sparkle

  // Sea-air breath — a whisper of band-passed noise, quickly gone.
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

  body.onended = () =>
    nodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        /* gone */
      }
    });
}

/** Selected Works voice — wood / canvas / gallery. `index` selects the note. */
export function playWood(index: number): void {
  const c = gate("wood" + index);
  if (!c || !master) return;
  const t = c.currentTime;
  const freq = WOOD_NOTES[index % WOOD_NOTES.length];

  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(0.9, t + 0.006); //   tap attack
  env.gain.exponentialRampToValueAtTime(0.9 * 0.4, t + 0.13); // short sustain
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.7); //    warm release

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
  const body = part(1, 0.85, "triangle"); // warm wooden body
  part(2.01, 0.14, "sine"); //              soft overtone

  // Tactile tap — a short band-passed noise, finger on wood / canvas.
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

  body.onended = () =>
    nodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        /* gone */
      }
    });
}
