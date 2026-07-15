/* ---------------------------------------------------------------------------
   Oyster navigation sound — a soft, pearlescent, aquatic synth voice.

   Each of the nine growth rings maps to one note of a C-major pentatonic scale
   (any hover sequence stays consonant). Inner ring 01 is the lowest note, the
   outer ring 09 the highest, so drifting outward rises and inward sinks.

   One shared AudioContext, created lazily on the user's first interaction with
   the page (never on load). After that first gesture the sound is simply on —
   there is no visible control. Silent while the tab is hidden.
--------------------------------------------------------------------------- */

// C-major pentatonic, C4 → G5 (inner → outer). Mid register: never bass-heavy.
const NOTES = [
  261.63, // 01  C4
  293.66, // 02  D4
  329.63, // 03  E4
  392.0, //  04  G4
  440.0, //  05  A4
  523.25, // 06  C5
  587.33, // 07  D5
  659.25, // 08  E5
  783.99, // 09  G5
];

// --- tuning --------------------------------------------------------------
const MASTER_GAIN = 0.5; // clearly audible, still soft/premium
const PEAK = 0.85; // per-note envelope peak
const SUSTAIN = 0.42; // short sustain plateau so the note sings (not a ping)
const DECAY_AT = 0.16; // seconds to reach the sustain level
const REVERB_WET = 0.1; // light shimmer — no longer masking the note
const ATTACK = 0.012; // ~12 ms fade-in — a touch more present
const DURATION = 0.9; // longer, singing tail
const COOLDOWN_MS = 220; // per-ring re-trigger guard while hovering
const MIN_GAP_MS = 45; // global spacing so notes don't stack loudly

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let enabled = false; // flips true on the first user gesture
let primed = false;
const lastPlayed: Record<number, number> = {};
let lastAny = 0;

// A short, procedurally generated impulse response — soft aquatic reverb tail
// with no audio file to download.
function makeImpulse(c: AudioContext, seconds: number, decay: number): AudioBuffer {
  const rate = c.sampleRate;
  const length = Math.floor(rate * seconds);
  const buffer = c.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
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

  // Gentle safety compression — high threshold so it only tames loud STACKS,
  // leaving single notes at full, audible level.
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -6;
  comp.knee.value = 18;
  comp.ratio.value = 3;
  comp.attack.value = 0.003;
  comp.release.value = 0.25;

  master.connect(comp);
  comp.connect(ctx.destination);

  reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx, 1.8, 2.6);
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = REVERB_WET;
  reverb.connect(reverbGain);
  reverbGain.connect(master);

  document.addEventListener("visibilitychange", onVisibility);
  console.log("[oyster-sound] AudioContext created; state:", ctx.state); // TEMP DEBUG
  return ctx;
}

// TEMP DEBUG — a simple, clearly audible 440 Hz confirmation tone played once
// on the first gesture so we can hear that audio is unlocked. Remove after.
function playTestTone(c: AudioContext) {
  if (!master) return;
  const t = c.currentTime;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.1, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
  g.connect(master);
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.value = 440;
  o.connect(g);
  o.start(t);
  o.stop(t + 0.34);
  o.onended = () => {
    try {
      o.disconnect();
      g.disconnect();
    } catch {
      /* gone */
    }
  };
  console.log("[oyster-sound] test tone 440 Hz played"); // TEMP DEBUG
}

/**
 * Arm the auto-enable: the first real interaction anywhere on the page
 * (pointer, touch, click or key) creates + resumes the shared AudioContext
 * and turns the sound on — respecting browser autoplay rules, with no button.
 * Safe to call repeatedly; only the first call arms.
 */
export function primeSound(): void {
  if (primed || typeof window === "undefined") return;
  primed = true;

  const EVENTS = ["pointerdown", "touchstart", "mousedown", "keydown"];
  const start = () => {
    enabled = true;
    const c = ensureContext();
    if (c) {
      c.resume()
        .then(() => {
          console.log("[oyster-sound] unlocked; state:", c.state); // TEMP DEBUG
          playTestTone(c); // TEMP DEBUG confirmation beep
        })
        .catch((err) => console.warn("[oyster-sound] resume failed", err)); // TEMP DEBUG
    }
    EVENTS.forEach((e) => window.removeEventListener(e, start, true));
  };
  // Capture phase + passive: fires before a ring's own handlers, never blocks.
  EVENTS.forEach((e) =>
    window.addEventListener(e, start, { capture: true, passive: true })
  );
}

/**
 * Play the note for ring `index` (0 = inner core … 8 = outer rim).
 * No-ops until the first gesture has enabled sound, or while the tab is
 * hidden; never blocks navigation.
 */
export function playOysterNote(index: number): void {
  if (!enabled) return;
  if (typeof document !== "undefined" && document.hidden) return;

  const c = ensureContext();
  if (!c || !master) return;
  if (c.state === "suspended") c.resume().catch(() => {});

  const clock =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  if (clock - (lastPlayed[index] || 0) < COOLDOWN_MS) return;
  if (clock - lastAny < MIN_GAP_MS) return;
  lastPlayed[index] = clock;
  lastAny = clock;

  const freq = NOTES[index] ?? NOTES[NOTES.length - 1];
  const t = c.currentTime;
  console.log("[oyster-sound] ring", index + 1, Math.round(freq) + "Hz"); // TEMP DEBUG

  // Soft envelope: quick attack → short sustain plateau → gentle release.
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(PEAK, t + ATTACK);
  env.gain.exponentialRampToValueAtTime(PEAK * SUSTAIN, t + DECAY_AT);
  env.gain.exponentialRampToValueAtTime(0.0001, t + DURATION);
  env.connect(master);
  if (reverb) env.connect(reverb);

  const nodes: AudioNode[] = [env];
  const partial = (type: OscillatorType, mult: number, level: number) => {
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.value = freq * mult;
    if (level >= 1) {
      osc.connect(env);
    } else {
      const g = c.createGain();
      g.gain.value = level;
      osc.connect(g);
      g.connect(env);
      nodes.push(g);
    }
    osc.start(t);
    osc.stop(t + DURATION + 0.05);
    nodes.push(osc);
    return osc;
  };

  const fundamental = partial("sine", 1, 1); //     soft sine body
  partial("triangle", 2, 0.12); //                  bell-like octave harmonic
  partial("sine", 3.01, 0.05); //                   glassy, slightly detuned shimmer

  fundamental.onended = () => {
    nodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        /* already gone */
      }
    });
  };
}
