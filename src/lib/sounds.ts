let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "square", gain = 0.15) {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

function playSequence(notes: [number, number][], type: OscillatorType = "square", gain = 0.12) {
  const c = getCtx();
  let t = c.currentTime;
  for (const [freq, dur] of notes) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur);
    t += dur * 0.8;
  }
}

export function playCorrect() {
  playSequence([[520, 0.08], [780, 0.12]], "square", 0.1);
}

export function playWrong() {
  playSequence([[200, 0.15], [150, 0.25]], "sawtooth", 0.1);
}

export function playCombo() {
  playSequence([[600, 0.06], [800, 0.06], [1000, 0.1]], "square", 0.08);
}

export function playLevelUp() {
  playSequence([
    [523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.2],
  ], "square", 0.12);
}

export function playCoin() {
  playSequence([[1200, 0.05], [1600, 0.08]], "sine", 0.1);
}

export function playAirHorn() {
  const c = getCtx();
  const freqs = [540, 440, 480, 520];
  for (const freq of freqs) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    g.gain.value = 0.06;
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8);
    osc.connect(g).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.8);
  }
}

export function playBuzz() {
  playTone(80, 0.3, "sawtooth", 0.2);
}
