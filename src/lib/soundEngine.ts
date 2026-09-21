"use client";

// Web Audio API procedural sound engine for 24OURS Drift & Dine
// Generates engine audio, doppler drive-by passes, ambient paddock rumble, and UI effects

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // Lazy initialize on first user gesture to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  // Play a realistic UI click tick
  public playClick(freq = 600) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  // Play high-tech hover sound
  public playHover() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Play cinematic sub-bass pulse / intro vibration
  public playSubBassPulse(duration = 2.5) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(55, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration + 0.1);
  }

  // Play complete cinematic kart approach and doppler drive-by sequence
  public playCinematicIntroSequence(onComplete?: () => void) {
    if (this.isMuted) {
      if (onComplete) setTimeout(onComplete, 7000);
      return;
    }
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // 1. Distant Sub-bass rumble (t = 0s to 4s)
    const rumbleOsc = this.ctx.createOscillator();
    const rumbleGain = this.ctx.createGain();
    rumbleOsc.type = "sawtooth";
    rumbleOsc.frequency.setValueAtTime(40, now);
    rumbleOsc.frequency.linearRampToValueAtTime(90, now + 3.5);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(140, now);
    lowpass.frequency.linearRampToValueAtTime(350, now + 3.5);

    rumbleGain.gain.setValueAtTime(0.001, now);
    rumbleGain.gain.linearRampToValueAtTime(0.18, now + 2.0);
    rumbleGain.gain.linearRampToValueAtTime(0.32, now + 3.5);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);

    rumbleOsc.connect(lowpass);
    lowpass.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);

    rumbleOsc.start(now);
    rumbleOsc.stop(now + 5.0);

    // 2. High-speed Electric / Gas Kart Engine Scream approaching (t = 2.0s to 4.2s)
    const engineOsc1 = this.ctx.createOscillator();
    const engineOsc2 = this.ctx.createOscillator();
    const engineGain = this.ctx.createGain();

    engineOsc1.type = "sawtooth";
    engineOsc2.type = "triangle";

    // Pitch rises sharply simulating approach, peaks at t = 3.6s, drops instantly for Doppler effect
    engineOsc1.frequency.setValueAtTime(180, now + 1.8);
    engineOsc1.frequency.exponentialRampToValueAtTime(680, now + 3.6);
    engineOsc1.frequency.exponentialRampToValueAtTime(220, now + 4.3);

    engineOsc2.frequency.setValueAtTime(360, now + 1.8);
    engineOsc2.frequency.exponentialRampToValueAtTime(1360, now + 3.6);
    engineOsc2.frequency.exponentialRampToValueAtTime(440, now + 4.3);

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(400, now + 1.8);
    bandpass.frequency.exponentialRampToValueAtTime(2200, now + 3.6);
    bandpass.frequency.exponentialRampToValueAtTime(600, now + 4.3);
    bandpass.Q.setValueAtTime(3.0, now + 1.8);

    engineGain.gain.setValueAtTime(0.0001, now + 1.8);
    engineGain.gain.linearRampToValueAtTime(0.28, now + 3.4);
    engineGain.gain.linearRampToValueAtTime(0.42, now + 3.65); // Doppler apex peak
    engineGain.gain.exponentialRampToValueAtTime(0.001, now + 4.6);

    engineOsc1.connect(bandpass);
    engineOsc2.connect(bandpass);
    bandpass.connect(engineGain);
    engineGain.connect(this.masterGain);

    engineOsc1.start(now + 1.8);
    engineOsc2.start(now + 1.8);
    engineOsc1.stop(now + 4.7);
    engineOsc2.stop(now + 4.7);

    // 3. Tire Screech & Chicane Drift Friction (t = 3.4s to 4.2s)
    const bufferSize = Math.floor(this.ctx.sampleRate * 1.0);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const screechFilter = this.ctx.createBiquadFilter();
    screechFilter.type = "bandpass";
    screechFilter.frequency.setValueAtTime(2800, now + 3.4);
    screechFilter.frequency.linearRampToValueAtTime(1400, now + 4.2);
    screechFilter.Q.setValueAtTime(6.0, now + 3.4);

    const screechGain = this.ctx.createGain();
    screechGain.gain.setValueAtTime(0.0001, now + 3.4);
    screechGain.gain.linearRampToValueAtTime(0.24, now + 3.65);
    screechGain.gain.exponentialRampToValueAtTime(0.001, now + 4.3);

    whiteNoise.connect(screechFilter);
    screechFilter.connect(screechGain);
    screechGain.connect(this.masterGain);

    whiteNoise.start(now + 3.4);
    whiteNoise.stop(now + 4.4);

    // 4. Logo Revelation / Cinematic Chord / Shimmer (t = 5.0s to 7.8s)
    const synthNotes = [220, 277.18, 329.63, 440, 554.37]; // A major 9th luxury chord
    synthNotes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const noteOsc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      noteOsc.type = idx % 2 === 0 ? "sine" : "triangle";
      noteOsc.frequency.setValueAtTime(freq, now + 5.0 + idx * 0.08);

      noteGain.gain.setValueAtTime(0.0001, now + 5.0 + idx * 0.08);
      noteGain.gain.linearRampToValueAtTime(0.07, now + 5.6 + idx * 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 7.8);

      noteOsc.connect(noteGain);
      noteGain.connect(this.masterGain);

      noteOsc.start(now + 5.0 + idx * 0.08);
      noteOsc.stop(now + 8.0);
    });

    if (onComplete) {
      setTimeout(onComplete, 8000);
    }
  }

  // Turbo Boost Sound Effect for 3D Kart
  public playBoostSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.4);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.65);
  }
}

export const soundEngine = new SoundEngine();
