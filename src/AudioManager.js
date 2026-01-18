export default class AudioManager {
  constructor() {
    this.sounds = {};
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.muted = false;
    
    // Create AudioContext for generating simple sounds
    this.audioContext = null;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }
  
  // Generate a simple tone
  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.audioContext || this.muted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }
  
  // Shoot sound effect
  playShoot() {
    if (this.muted) return;
    this.playTone(800, 0.1, 'square', 0.15);
  }
  
  // Hit sound effect
  playHit() {
    if (this.muted) return;
    this.playTone(300, 0.15, 'sawtooth', 0.2);
  }
  
  // Explosion sound effect
  playExplosion() {
    if (this.muted) return;
    // Multi-layered explosion sound
    this.playTone(100, 0.3, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(50, 0.4, 'square', 0.2), 50);
  }
  
  // Power up sound
  playPowerUp() {
    if (this.muted) return;
    this.playTone(400, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(600, 0.1, 'sine', 0.2), 100);
    setTimeout(() => this.playTone(800, 0.2, 'sine', 0.2), 200);
  }
  
  // Round win sound
  playRoundWin() {
    if (this.muted) return;
    this.playTone(523, 0.15, 'sine', 0.25);
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.25), 150);
    setTimeout(() => this.playTone(784, 0.3, 'sine', 0.25), 300);
  }
  
  // Game over sound
  playGameOver() {
    if (this.muted) return;
    this.playTone(400, 0.2, 'sine', 0.3);
    setTimeout(() => this.playTone(300, 0.2, 'sine', 0.3), 200);
    setTimeout(() => this.playTone(200, 0.4, 'sine', 0.3), 400);
  }
  
  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
  
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}
