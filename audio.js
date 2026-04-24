const AudioManager = {
    audioContext: null,
    bgmEnabled: true,
    sfxEnabled: true,
    volume: 0.7,
    bgmOscillators: [],
    isInitialized: false,

    init() {
        if (this.isInitialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            console.log('音频系统初始化成功');
        } catch (e) {
            console.log('Web Audio API 不支持:', e);
        }
    },

    ensureContext() {
        if (!this.audioContext || this.audioContext.state === 'closed') {
            this.isInitialized = false;
            this.init();
        }
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },

    setBGMEnabled(enabled) {
        this.bgmEnabled = enabled;
        if (!enabled) {
            this.stopBGM();
        }
    },

    setSFXEnabled(enabled) {
        this.sfxEnabled = enabled;
    },

    setVolume(volume) {
        this.volume = volume / 100;
    },

    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        this.ensureContext();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(volume * this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    playScrewUnscrew() {
        this.ensureContext();
        
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        for (let i = 0; i < 5; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(200 + i * 50, now + i * 0.08);
            oscillator.frequency.exponentialRampToValueAtTime(100, now + i * 0.08 + 0.08);
            
            gainNode.gain.setValueAtTime(0.15 * this.volume, now + i * 0.08);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.08);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(now + i * 0.08);
            oscillator.stop(now + i * 0.08 + 0.1);
        }
    },

    playScrewScrew() {
        this.ensureContext();
        
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        for (let i = 0; i < 5; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(100 + i * 50, now + i * 0.08);
            oscillator.frequency.exponentialRampToValueAtTime(300, now + i * 0.08 + 0.08);
            
            gainNode.gain.setValueAtTime(0.15 * this.volume, now + i * 0.08);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.08);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(now + i * 0.08);
            oscillator.stop(now + i * 0.08 + 0.1);
        }
    },

    playPixelReveal() {
        this.ensureContext();
        
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        const frequencies = [523.25, 659.25, 783.99];
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, now + index * 0.1);
            
            gainNode.gain.setValueAtTime(0.2 * this.volume, now + index * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.3);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(now + index * 0.1);
            oscillator.stop(now + index * 0.1 + 0.35);
        });
    },

    playClick() {
        this.ensureContext();
        
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3 * this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.15);
    },

    playLevelComplete() {
        this.ensureContext();
        
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        const melody = [
            {freq: 523.25, duration: 0.2, delay: 0},
            {freq: 659.25, duration: 0.2, delay: 0.2},
            {freq: 783.99, duration: 0.2, delay: 0.4},
            {freq: 1046.50, duration: 0.5, delay: 0.6}
        ];
        
        melody.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(note.freq, now + note.delay);
            
            gainNode.gain.setValueAtTime(0.3 * this.volume, now + note.delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.delay + note.duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(now + note.delay);
            oscillator.stop(now + note.delay + note.duration + 0.05);
        });
    },

    playError() {
        this.ensureContext();
        
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2 * this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.25);
    },

    playHint() {
        this.ensureContext();
        
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        [0, 0.15, 0.3].forEach((delay, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600 + index * 100, now + delay);
            
            gainNode.gain.setValueAtTime(0.2 * this.volume, now + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(now + delay);
            oscillator.stop(now + delay + 0.2);
        });
    },

    playBGM() {
        if (!this.bgmEnabled || !this.audioContext) return;
        
        this.ensureContext();
        this.stopBGM();
        
        const now = this.audioContext.currentTime;
        
        const baseNotes = [
            {freq: 261.63, duration: 0.4, delay: 0},
            {freq: 293.66, duration: 0.4, delay: 0.5},
            {freq: 329.63, duration: 0.4, delay: 1.0},
            {freq: 293.66, duration: 0.4, delay: 1.5},
            {freq: 261.63, duration: 0.4, delay: 2.0},
            {freq: 329.63, duration: 0.4, delay: 2.5},
            {freq: 293.66, duration: 0.4, delay: 3.0},
            {freq: 261.63, duration: 0.8, delay: 3.5}
        ];
        
        const playLoop = () => {
            if (!this.bgmEnabled) return;
            
            const loopTime = this.audioContext.currentTime;
            
            baseNotes.forEach(note => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(note.freq * 0.5, loopTime + note.delay);
                
                gainNode.gain.setValueAtTime(0.08 * this.volume, loopTime + note.delay);
                gainNode.gain.exponentialRampToValueAtTime(0.001, loopTime + note.delay + note.duration);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start(loopTime + note.delay);
                oscillator.stop(loopTime + note.delay + note.duration + 0.05);
                
                this.bgmOscillators.push(oscillator);
            });
            
            setTimeout(() => {
                if (this.bgmEnabled) {
                    playLoop();
                }
            }, 4500);
        };
        
        playLoop();
    },

    stopBGM() {
        this.bgmOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {}
        });
        this.bgmOscillators = [];
    }
};

document.addEventListener('click', () => {
    AudioManager.ensureContext();
}, { once: true });
