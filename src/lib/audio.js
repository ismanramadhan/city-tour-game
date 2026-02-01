// Audio utilities untuk efek suara
let audioContext = null;

// Inisialisasi AudioContext (lazy initialization)
const getAudioContext = () => {
  if (!audioContext && typeof window !== "undefined") {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Efek suara klik untuk node map
export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Suara klik yang pleasant (C note dengan decay cepat)
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.type = "sine";

    // Envelope ADSR untuk suara klik yang smooth
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  } catch (error) {
    // Silently fail jika audio tidak didukung
    console.warn("Audio playback failed:", error);
  }
};

// Efek suara untuk node yang terkunci
export const playLockedSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Suara "denied" - nada rendah
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.type = "triangle";

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (error) {
    console.warn("Audio playback failed:", error);
  }
};
