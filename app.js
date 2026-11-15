/**
 * ChronoPulse - Next-Gen Expressive Clock
 * Full Application Logic
 */

// ============================================================================
// 1. STATE & PERSISTENCE
// ============================================================================
const DEFAULT_CITIES = [
  { id: 'nyc', name: 'New York', country: 'United States', timezone: 'America/New_York', flag: '🇺🇸' },
  { id: 'london', name: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪' },
];

const ALL_CITIES_DATABASE = [
  { id: 'nyc', name: 'New York', country: 'United States', timezone: 'America/New_York', flag: '🇺🇸' },
  { id: 'london', name: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'paris', name: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { id: 'sf', name: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
  { id: 'sp', name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
  { id: 'reykjavik', name: 'Reykjavik', country: 'Iceland', timezone: 'Atlantic/Reykjavik', flag: '🇮🇸' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿' },
];

const DEFAULT_ALARMS = [
  {
    id: 'alm-1',
    hour: 7,
    minute: 0,
    period: 'AM',
    label: 'Morning Workout 🏋️',
    enabled: true,
    days: [1, 2, 3, 4, 5], // Mon-Fri
    sound: 'marimba',
    gentleWake: true,
    snoozeMinutes: 5,
  },
  {
    id: 'alm-2',
    hour: 8,
    minute: 30,
    period: 'AM',
    label: 'Daily Team Standup 💻',
    enabled: true,
    days: [1, 2, 3, 4, 5], // Mon-Fri
    sound: 'chime',
    gentleWake: false,
    snoozeMinutes: 5,
  },
  {
    id: 'alm-3',
    hour: 10,
    minute: 0,
    period: 'PM',
    label: 'Wind Down & Read 📚',
    enabled: true,
    days: [0, 1, 2, 3, 4, 5, 6], // Everyday
    sound: 'bells',
    gentleWake: true,
    snoozeMinutes: 10,
  },
  {
    id: 'alm-4',
    hour: 9,
    minute: 15,
    period: 'AM',
    label: 'Weekend Brunch & Run 🥐',
    enabled: false,
    days: [0, 6], // Sun, Sat
    sound: 'bird',
    gentleWake: true,
    snoozeMinutes: 10,
  }
];

let appState = {
  currentTab: 'times',
  is24Hour: false,
  soundEffects: true,
  currentTheme: 'indigo',
  timeScrubberOffset: 0, // In hours (-12 to +12)
  alarms: [],
  alarmFilter: 'all',
  editingAlarmId: null,
  cities: [],
  activeRingingAlarm: null,
  
  // Stopwatch state
  stopwatch: {
    isRunning: false,
    startTime: 0,
    elapsedTime: 0,
    lapStartTime: 0,
    lapElapsedTime: 0,
    laps: [],
    animFrame: null,
  },

  // Multi-Timers state
  timers: [
    {
      id: 'timer-preset-1',
      label: 'Pomodoro Focus 🍅',
      totalSeconds: 1500, // 25 min
      remainingSeconds: 1500,
      isRunning: false,
      sound: 'chime',
    },
    {
      id: 'timer-preset-2',
      label: 'Quick Tea 🫖',
      totalSeconds: 180, // 3 min
      remainingSeconds: 180,
      isRunning: false,
      sound: 'bells',
    }
  ],

  // Ambient Sounds state
  ambient: {
    activeType: null,
    volume: 0.5,
    sleepTimerMinutes: 0,
    sleepTimerTimeout: null,
  }
};

// Load saved settings
function loadSavedState() {
  try {
    const savedAlarms = localStorage.getItem('chronopulse_alarms');
    if (savedAlarms) appState.alarms = JSON.parse(savedAlarms);
    else appState.alarms = DEFAULT_ALARMS;

    const savedCities = localStorage.getItem('chronopulse_cities');
    if (savedCities) appState.cities = JSON.parse(savedCities);
    else appState.cities = DEFAULT_CITIES;

    const savedTheme = localStorage.getItem('chronopulse_theme');
    if (savedTheme) setAppTheme(savedTheme, false);

    const savedFormat = localStorage.getItem('chronopulse_format');
    if (savedFormat !== null) appState.is24Hour = savedFormat === 'true';

    const savedSound = localStorage.getItem('chronopulse_sound');
    if (savedSound !== null) appState.soundEffects = savedSound === 'true';

  } catch (e) {
    console.warn('Could not load localStorage, using defaults', e);
    appState.alarms = DEFAULT_ALARMS;
    appState.cities = DEFAULT_CITIES;
  }
}

function saveAlarmsState() {
  try {
    localStorage.setItem('chronopulse_alarms', JSON.stringify(appState.alarms));
  } catch (e) {}
}

function saveCitiesState() {
  try {
    localStorage.setItem('chronopulse_cities', JSON.stringify(appState.cities));
  } catch (e) {}
}

// ============================================================================
// 2. AUDIO SYNTHESIZER ENGINE (Web Audio API)
// ============================================================================
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.alarmLoopInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft tactile UI click
  playUiClick() {
    if (!appState.soundEffects) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  // Squishy switch toggle sound (rising for ON, falling for OFF)
  playSwitchPop(isOn) {
    if (!appState.soundEffects) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      if (isOn) {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.06);
      } else {
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.06);
      }

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.075);
    } catch (e) {}
  }

  // Synthesized melodies for alarms & timers
  playMelody(type = 'chime') {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (type === 'chime') {
      // Cosmic Chime: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.12;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });

    } else if (type === 'marimba') {
      // Warm Zen Marimba: F4, A4, C5, E5, G5
      const notes = [349.23, 440.0, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });

    } else if (type === 'bells') {
      // Radiant Tubular Bells
      const notes = [587.33, 739.99, 880.0];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const harm = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.18;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        harm.type = 'sine';
        harm.frequency.setValueAtTime(freq * 2.76, startTime); // Metallic harmonic

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

        osc.connect(gain);
        harm.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        harm.start(startTime);
        osc.stop(startTime + 0.85);
        harm.stop(startTime + 0.85);
      });

    } else if (type === 'pulse') {
      // Cyber Synth Pulse
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });

    } else if (type === 'bird') {
      // Gentle Morning Birdsong Chirp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(2000, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(2800, now + 0.25);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  }

  // Start continuous looping alarm ring
  startAlarm(type = 'chime') {
    this.stopAlarm();
    this.playMelody(type);
    this.alarmLoopInterval = setInterval(() => {
      this.playMelody(type);
    }, 1800);
  }

  stopAlarm() {
    if (this.alarmLoopInterval) {
      clearInterval(this.alarmLoopInterval);
      this.alarmLoopInterval = null;
    }
  }

  // Synthesize Ambient Sounds (Rain, Waves, Fire, Crickets, Space, White Noise)
  startAmbient(type) {
    this.stopAmbient();
    this.init();
    if (!this.ctx) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(appState.ambient.volume, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      whiteNoise.connect(this.ambientGain);
      whiteNoise.start();
      this.ambientSource = whiteNoise;

    } else if (type === 'rain') {
      // Pink/Brown noise filtered for rain
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.08;
        b2 = 0.85 * b2 + white * 0.12;
        output[i] = b0 + b1 + b2;
      }
      const rainSource = this.ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, this.ctx.currentTime);

      rainSource.connect(filter);
      filter.connect(this.ambientGain);
      rainSource.start();
      this.ambientSource = rainSource;

    } else if (type === 'waves') {
      // Modulated brown noise for ocean waves
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
      const waveSource = this.ctx.createBufferSource();
      waveSource.buffer = noiseBuffer;
      waveSource.loop = true;

      // LFO filter for ocean swell
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec wave swell
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(300, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      waveSource.connect(filter);
      filter.connect(this.ambientGain);
      waveSource.start();
      this.ambientSource = waveSource;

    } else if (type === 'space') {
      // Deep Space Harmonic Drone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(108, this.ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(162, this.ctx.currentTime); // Perfect 5th
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(216, this.ctx.currentTime); // Octave

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      osc1.connect(subGain);
      osc2.connect(subGain);
      osc3.connect(subGain);
      subGain.connect(this.ambientGain);

      osc1.start();
      osc2.start();
      osc3.start();
      this.ambientSource = {
        stop: () => {
          osc1.stop();
          osc2.stop();
          osc3.stop();
        }
      };

    } else if (type === 'fire') {
      // Crackle generator
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() < 0.008 ? (Math.random() * 2 - 1) * 2.5 : (Math.random() * 0.05);
      }
      const fireSource = this.ctx.createBufferSource();
      fireSource.buffer = noiseBuffer;
      fireSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      fireSource.connect(filter);
      filter.connect(this.ambientGain);
      fireSource.start();
      this.ambientSource = fireSource;

    } else if (type === 'crickets') {
      // Forest Crickets high chirp
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(4500, this.ctx.currentTime);

      // Tremolo
      const tremolo = this.ctx.createOscillator();
      tremolo.frequency.setValueAtTime(14, this.ctx.currentTime);
      const tremoloGain = this.ctx.createGain();
      tremoloGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

      const amp = this.ctx.createGain();
      amp.gain.setValueAtTime(0.15, this.ctx.currentTime);

      tremolo.connect(amp.gain);
      osc.connect(amp);
      amp.connect(this.ambientGain);

      osc.start();
      tremolo.start();
      this.ambientSource = {
        stop: () => {
          osc.stop();
          tremolo.stop();
        }
      };
    }
  }

  setAmbientVolume(vol) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
      } catch (e) {}
      this.ambientSource = null;
    }
  }
}

const audio = new AudioSynthesizer();

// ============================================================================
// 3. NAVIGATION & APP CONTROLS
// ============================================================================
function switchTab(tabId) {
  audio.playUiClick();
  appState.currentTab = tabId;

  // Update nav tabs visual
  document.querySelectorAll('.nav-pill').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Switch tab pane
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.add('hidden');
  });
  const target = document.getElementById(`tab-content-${tabId}`);
  if (target) {
    target.classList.remove('hidden');
  }

  // Refresh tab specific data
  if (tabId === 'times') {
    renderWorldCities();
  } else if (tabId === 'alarms') {
    renderAlarmTiles();
  } else if (tabId === 'timers') {
    renderTimers();
  } else if (tabId === 'sleep') {
    renderSleepCycles();
  }

  updateDynamicIsland();
}

function setAppTheme(themeName, playSound = true) {
  if (playSound) audio.playUiClick();
  appState.currentTheme = themeName;
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('chronopulse_theme', themeName);

  // Update theme indicator dot & label
  const themeDot = document.getElementById('current-theme-dot');
  const themeLabel = document.getElementById('current-theme-label');
  const themeDropdown = document.getElementById('theme-dropdown');
  if (themeDropdown) themeDropdown.classList.add('hidden');

  const themeColors = {
    indigo: { color: '#4F46E5', name: 'Pixel Indigo' },
    sunset: { color: '#F97316', name: 'Sunset Coral' },
    sage: { color: '#10B981', name: 'Sage Emerald' },
    lavender: { color: '#A855F7', name: 'Lavender Dream' },
    cyber: { color: '#22C55E', name: 'Cyber OLED Neon' },
    solar: { color: '#EAB308', name: 'Solar Amber' },
  };

  if (themeDot && themeColors[themeName]) {
    themeDot.style.backgroundColor = themeColors[themeName].color;
  }
  if (themeLabel && themeColors[themeName]) {
    themeLabel.textContent = themeColors[themeName].name;
  }

  // Re-render analog clock colors
  updateAnalogClockHands(new Date());
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  const text = document.getElementById('toast-text');
  if (container && text) {
    text.textContent = message;
    container.classList.remove('opacity-0', '-translate-y-4');
    container.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
      container.classList.remove('opacity-100', 'translate-y-0');
      container.classList.add('opacity-0', '-translate-y-4');
    }, 2400);
  }
}

// ============================================================================
// 4. TIMES & WORLD CLOCK LOGIC
// ============================================================================
function initAnalogClockDial() {
  const ticksGroup = document.getElementById('clock-ticks');
  if (!ticksGroup) return;

  ticksGroup.innerHTML = '';
  // Generate 60 ticks (12 major hour ticks and 48 minor minute ticks)
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6) * (Math.PI / 180);
    const isHour = i % 5 === 0;
    const outerRadius = 90;
    const innerRadius = isHour ? 78 : 84;

    const x1 = 100 + outerRadius * Math.sin(angle);
    const y1 = 100 - outerRadius * Math.cos(angle);
    const x2 = 100 + innerRadius * Math.sin(angle);
    const y2 = 100 - innerRadius * Math.cos(angle);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', isHour ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.15)');
    line.setAttribute('stroke-width', isHour ? '2.5' : '1.2');
    line.setAttribute('stroke-linecap', 'round');
    ticksGroup.appendChild(line);
  }
}

function updateAnalogClockHands(date) {
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();

  // Smooth continuous sweep
  const secAngle = ((seconds + milliseconds / 1000) / 60) * 360;
  const minAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = (((hours % 12) + minutes / 60) / 12) * 360;

  const secHand = document.getElementById('analog-second');
  const minHand = document.getElementById('analog-minute');
  const hourHand = document.getElementById('analog-hour');

  if (secHand) secHand.setAttribute('transform', `rotate(${secAngle} 100 100)`);
  if (minHand) minHand.setAttribute('transform', `rotate(${minAngle} 100 100)`);
  if (hourHand) hourHand.setAttribute('transform', `rotate(${hourAngle} 100 100)`);
}

function updateLiveClock() {
  const now = new Date();
  
  // Apply time scrubber offset
  const scrubbedTime = new Date(now.getTime() + appState.timeScrubberOffset * 3600 * 1000);

  // Digital Hero Clock
  let hours = scrubbedTime.getHours();
  const minutes = String(scrubbedTime.getMinutes()).padStart(2, '0');
  const seconds = String(scrubbedTime.getSeconds()).padStart(2, '0');
  let period = '';

  if (!appState.is24Hour) {
    period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }
  const hoursFormatted = String(hours).padStart(2, '0');

  const heroTimeEl = document.getElementById('hero-clock-time');
  const heroPeriodEl = document.getElementById('hero-clock-period');
  if (heroTimeEl) heroTimeEl.textContent = `${hoursFormatted}:${minutes}:${seconds}`;
  if (heroPeriodEl) {
    heroPeriodEl.textContent = period;
    heroPeriodEl.style.display = appState.is24Hour ? 'none' : 'inline';
  }

  // Date & Day/Night Indicator
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const dateFormatted = scrubbedTime.toLocaleDateString('en-US', options);
  const heroDateEl = document.getElementById('hero-clock-date');
  if (heroDateEl) heroDateEl.textContent = dateFormatted;

  const rawHours = scrubbedTime.getHours();
  const isDay = rawHours >= 6 && rawHours < 18;
  const sunCycleEl = document.getElementById('sun-cycle-text');
  const sunMoonIcon = document.getElementById('sun-moon-icon');
  if (sunCycleEl) sunCycleEl.textContent = isDay ? 'Daytime ☀️' : 'Nighttime 🌙';

  // Update analog hands
  updateAnalogClockHands(scrubbedTime);

  // Nightstand Desk Mode Time
  const nightstandTimeEl = document.getElementById('nightstand-time');
  const nightstandPeriodEl = document.getElementById('nightstand-period');
  const nightstandDateEl = document.getElementById('nightstand-date');
  if (nightstandTimeEl) nightstandTimeEl.textContent = `${hoursFormatted}:${minutes}`;
  if (nightstandPeriodEl) {
    nightstandPeriodEl.textContent = period;
    nightstandPeriodEl.style.display = appState.is24Hour ? 'none' : 'inline';
  }
  if (nightstandDateEl) {
    nightstandDateEl.textContent = scrubbedTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  // Check Alarms trigger every second (only at 0 seconds or exact minute change)
  if (now.getSeconds() === 0 && appState.timeScrubberOffset === 0) {
    checkActiveAlarms(now);
  }
}

// Interactive Time Traveler Scrubber
function handleTimeScrubber(value) {
  appState.timeScrubberOffset = parseFloat(value);
  const label = document.getElementById('scrubber-offset-label');
  if (label) {
    if (appState.timeScrubberOffset === 0) {
      label.textContent = 'Current Time (+0h)';
      label.classList.remove('bg-amber-500/20', 'text-amber-300', 'border-amber-500/30');
      label.classList.add('bg-indigo-500/20', 'text-indigo-300', 'border-indigo-500/30');
    } else {
      const sign = appState.timeScrubberOffset > 0 ? '+' : '';
      label.textContent = `Preview Offset (${sign}${appState.timeScrubberOffset} hrs)`;
      label.classList.remove('bg-indigo-500/20', 'text-indigo-300', 'border-indigo-500/30');
      label.classList.add('bg-amber-500/20', 'text-amber-300', 'border-amber-500/30');
    }
  }
  renderWorldCities();
}

function resetTimeScrubber() {
  audio.playUiClick();
  const slider = document.getElementById('time-scrubber-slider');
  if (slider) slider.value = 0;
  handleTimeScrubber(0);
}

// Render World Cities Bento Grid
function renderWorldCities() {
  const container = document.getElementById('world-cities-grid');
  const countBadge = document.getElementById('city-count-badge');
  if (!container) return;

  if (countBadge) countBadge.textContent = `${appState.cities.length} cities`;

  const now = new Date();
  const scrubbedNow = new Date(now.getTime() + appState.timeScrubberOffset * 3600 * 1000);

  container.innerHTML = appState.cities.map(city => {
    // Calculate city local time
    let cityTime;
    try {
      const cityString = scrubbedNow.toLocaleString('en-US', { timeZone: city.timezone });
      cityTime = new Date(cityString);
    } catch (e) {
      cityTime = scrubbedNow;
    }

    let h = cityTime.getHours();
    const m = String(cityTime.getMinutes()).padStart(2, '0');
    let p = '';
    if (!appState.is24Hour) {
      p = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
    }
    const hStr = String(h).padStart(2, '0');
    const isDay = cityTime.getHours() >= 6 && cityTime.getHours() < 18;

    // Time difference calculation relative to local device
    const localHour = scrubbedNow.getHours() + scrubbedNow.getMinutes() / 60;
    const cityHour = cityTime.getHours() + cityTime.getMinutes() / 60;
    let diff = Math.round((cityHour - localHour) * 10) / 10;
    if (diff > 12) diff -= 24;
    if (diff < -12) diff += 24;
    const diffStr = diff === 0 ? 'Same time' : (diff > 0 ? `+${diff} hrs` : `${diff} hrs`);

    // Mini analog clock angles
    const secAngle = (cityTime.getSeconds() / 60) * 360;
    const minAngle = ((cityTime.getMinutes() + cityTime.getSeconds() / 60) / 60) * 360;
    const hourAngle = (((cityTime.getHours() % 12) + cityTime.getMinutes() / 60) / 12) * 360;

    return `
      <div class="tactile-card glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between group relative overflow-hidden">
        <div class="flex items-start justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center gap-1.5">
              <span class="text-base">${city.flag}</span>
              <h3 class="font-bold text-white text-base tracking-tight">${city.name}</h3>
            </div>
            <p class="text-xs text-slate-400 font-medium">${city.country}</p>
          </div>

          <!-- Mini Analog Clock -->
          <div class="w-12 h-12 rounded-full bg-slate-900/90 border border-white/10 p-0.5 flex-shrink-0 relative shadow-md">
            <svg class="w-full h-full" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <!-- Hour hand -->
              <line x1="20" y1="20" x2="20" y2="10" stroke="#FFF" stroke-width="1.8" stroke-linecap="round" transform="rotate(${hourAngle} 20 20)"/>
              <!-- Minute hand -->
              <line x1="20" y1="20" x2="20" y2="6" stroke="#94A3B8" stroke-width="1.2" stroke-linecap="round" transform="rotate(${minAngle} 20 20)"/>
              <circle cx="20" cy="20" r="1.5" fill="var(--primary)"/>
            </svg>
          </div>
        </div>

        <!-- Big City Digital Time & Badges -->
        <div class="mt-4 pt-3 border-t border-white/5 flex items-end justify-between">
          <div>
            <div class="flex items-baseline gap-1 font-mono font-black text-2xl text-white font-mono-numbers">
              <span>${hStr}:${m}</span>
              ${!appState.is24Hour ? `<span class="text-xs font-bold text-indigo-400">${p}</span>` : ''}
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${isDay ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'} flex items-center gap-1">
                ${isDay ? '☀️ Day' : '🌙 Night'}
              </span>
              <span class="text-[10px] font-mono text-slate-400">${diffStr}</span>
            </div>
          </div>

          <!-- Quick Delete City Button -->
          <button onclick="removeCity('${city.id}')" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300" title="Remove City">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function openAddCityModal() {
  audio.playUiClick();
  const modal = document.getElementById('modal-add-city');
  if (modal) {
    modal.classList.remove('hidden');
    searchCityFilter('');
    const input = document.getElementById('city-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

function closeAddCityModal() {
  const modal = document.getElementById('modal-add-city');
  if (modal) modal.classList.add('hidden');
}

function searchCityFilter(query) {
  const container = document.getElementById('city-search-results');
  if (!container) return;

  const currentIds = appState.cities.map(c => c.id);
  const filtered = ALL_CITIES_DATABASE.filter(c => {
    const match = c.name.toLowerCase().includes(query.toLowerCase()) || 
                  c.country.toLowerCase().includes(query.toLowerCase());
    return match && !currentIds.includes(c.id);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500 text-center py-4">No matching cities found.</p>`;
    return;
  }

  container.innerHTML = filtered.map(city => `
    <button onclick="addCity('${city.id}')" class="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 text-left transition-all tactile-btn">
      <div class="flex items-center gap-2.5">
        <span class="text-xl">${city.flag}</span>
        <div>
          <h4 class="text-sm font-bold text-white">${city.name}</h4>
          <p class="text-xs text-slate-400">${city.country}</p>
        </div>
      </div>
      <span class="text-xs font-semibold px-2.5 py-1 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
        + Add
      </span>
    </button>
  `).join('');
}

function addCity(cityId) {
  audio.playUiClick();
  const found = ALL_CITIES_DATABASE.find(c => c.id === cityId);
  if (found) {
    appState.cities.push(found);
    saveCitiesState();
    renderWorldCities();
    closeAddCityModal();
    showToast(`Added ${found.name} to World Clock`);
  }
}

function removeCity(cityId) {
  audio.playUiClick();
  appState.cities = appState.cities.filter(c => c.id !== cityId);
  saveCitiesState();
  renderWorldCities();
  showToast('City removed');
}

// ============================================================================
// 5. ALARMS ENGINE (TILES BENTO GRID)
// ============================================================================
// Calculates the human-readable countdown to the next alarm trigger
function getNextAlarmCountdown(alarm) {
  if (!alarm.enabled) return 'Disabled';

  const now = new Date();
  const currentDay = now.getDay();
  let alarmHour24 = alarm.hour;
  if (alarm.period === 'PM' && alarm.hour < 12) alarmHour24 += 12;
  if (alarm.period === 'AM' && alarm.hour === 12) alarmHour24 = 0;

  // Find next occurring day
  let daysUntil = 0;
  let found = false;

  const activeDays = alarm.days.length > 0 ? alarm.days : [currentDay];

  for (let i = 0; i < 7; i++) {
    const checkDay = (currentDay + i) % 7;
    if (activeDays.includes(checkDay)) {
      if (i === 0) {
        // Today: check if time has already passed
        const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), alarmHour24, alarm.minute, 0);
        if (targetTime > now) {
          daysUntil = 0;
          found = true;
          break;
        }
      } else {
        daysUntil = i;
        found = true;
        break;
      }
    }
  }

  if (!found) daysUntil = 7;

  const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntil, alarmHour24, alarm.minute, 0);
  const diffMs = targetDate - now;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHrs === 0 && diffMins === 0) return 'Rings in < 1 min';
  if (diffHrs === 0) return `Rings in ${diffMins} min`;
  return `Rings in ${diffHrs}h ${diffMins}m`;
}

// Render Alarms Bento Grid Tiles
function renderAlarmTiles() {
  const container = document.getElementById('alarms-tiles-container');
  const emptyState = document.getElementById('alarms-empty-state');
  const summaryText = document.getElementById('alarms-summary-text');
  const alarmTabBadge = document.getElementById('tab-alarm-badge');
  const nightstandAlarmEl = document.getElementById('nightstand-next-alarm');

  if (!container) return;

  // Filter alarms
  let list = appState.alarms;
  if (appState.alarmFilter === 'active') {
    list = list.filter(a => a.enabled);
  } else if (appState.alarmFilter === 'weekdays') {
    list = list.filter(a => a.days.some(d => d >= 1 && d <= 5));
  } else if (appState.alarmFilter === 'weekends') {
    list = list.filter(a => a.days.some(d => d === 0 || d === 6));
  }

  const activeCount = appState.alarms.filter(a => a.enabled).length;
  if (alarmTabBadge) alarmTabBadge.textContent = activeCount;

  // Update summary header
  const nextActive = appState.alarms.find(a => a.enabled);
  if (summaryText) {
    if (activeCount === 0) {
      summaryText.textContent = 'All alarms are currently off';
    } else if (nextActive) {
      summaryText.textContent = `${activeCount} active ${activeCount === 1 ? 'alarm' : 'alarms'} • Next ${getNextAlarmCountdown(nextActive).toLowerCase()}`;
    }
  }

  if (nightstandAlarmEl) {
    if (nextActive) {
      const h = String(nextActive.hour).padStart(2, '0');
      const m = String(nextActive.minute).padStart(2, '0');
      nightstandAlarmEl.textContent = `Next alarm: ${h}:${m} ${nextActive.period}`;
    } else {
      nightstandAlarmEl.textContent = 'No alarms set';
    }
  }

  if (list.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }
  if (emptyState) emptyState.classList.add('hidden');

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  container.innerHTML = list.map(alarm => {
    const formattedHour = String(alarm.hour).padStart(2, '0');
    const formattedMinute = String(alarm.minute).padStart(2, '0');
    const countdown = getNextAlarmCountdown(alarm);
    const soundNames = {
      chime: 'Cosmic Chime',
      marimba: 'Zen Marimba',
      bells: 'Radiant Bells',
      pulse: 'Cyber Pulse',
      bird: 'Birdsong'
    };

    return `
      <div class="alarm-tile ${alarm.enabled ? 'active-alarm' : 'inactive-alarm'} p-6 flex flex-col justify-between relative group" id="tile-${alarm.id}">
        
        <!-- Top Row: Category Tag, Countdown Pill & 3-Dot Quick Menu -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full ${alarm.enabled ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-white/5 text-slate-400'}">
              ${alarm.label || 'Alarm'}
            </span>
          </div>

          <!-- Actions Dropdown Trigger -->
          <div class="flex items-center gap-1">
            <button onclick="testAlarmRinger('${alarm.id}')" class="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" title="Test Ring Alarm">
              <i data-lucide="play" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="editAlarm('${alarm.id}')" class="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" title="Edit Alarm">
              <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteAlarm('${alarm.id}')" class="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300" title="Delete Alarm">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- Main Body: Giant Expressive Digits & Countdown -->
        <div class="my-4">
          <div class="flex items-baseline gap-2 font-mono font-black tracking-tight text-white font-mono-numbers">
            <span class="text-5xl sm:text-6xl">${formattedHour}:${formattedMinute}</span>
            <span class="text-2xl sm:text-3xl font-bold ${alarm.enabled ? 'text-indigo-400' : 'text-slate-500'}">
              ${alarm.period}
            </span>
          </div>

          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs font-mono font-medium ${alarm.enabled ? 'text-cyan-400' : 'text-slate-500'}">
              ${countdown}
            </span>
            ${alarm.gentleWake ? `
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                🌱 Gentle
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Day Pills: Clickable directly on the tile! -->
        <div class="pt-3 border-t border-white/10 flex items-center justify-between gap-1">
          <div class="flex items-center gap-1">
            ${dayLabels.map((lbl, idx) => `
              <button onclick="toggleAlarmDay('${alarm.id}', ${idx})" 
                      class="day-pill ${alarm.days.includes(idx) ? 'active' : 'inactive'}"
                      title="Toggle ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][idx]}">
                ${lbl}
              </button>
            `).join('')}
          </div>

          <!-- M3 Expressive Squishy Toggle Switch -->
          <label class="squishy-switch ml-2" title="Toggle Alarm">
            <input type="checkbox" ${alarm.enabled ? 'checked' : ''} onchange="toggleAlarmSwitch('${alarm.id}', this.checked)">
            <span class="squishy-slider"></span>
          </label>
        </div>

        <!-- Bottom Ringtone Preview Bar -->
        <div class="mt-3 pt-2 flex items-center justify-between text-xs text-slate-400">
          <div class="flex items-center gap-1.5">
            <button onclick="previewAlarmRingtone('${alarm.sound}')" class="hover:text-indigo-300 flex items-center gap-1">
              <i data-lucide="music" class="w-3.5 h-3.5 text-indigo-400"></i>
              <span class="text-[11px] font-semibold">${soundNames[alarm.sound] || 'Cosmic Chime'}</span>
            </button>
          </div>
          <span class="text-[10px] text-slate-500 font-mono">Snooze: ${alarm.snoozeMinutes || 5}m</span>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function filterAlarms(filter) {
  audio.playUiClick();
  appState.alarmFilter = filter;
  document.querySelectorAll('.alarm-filter-chip').forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.classList.add('bg-indigo-600', 'text-white');
      btn.classList.remove('text-slate-400');
    } else {
      btn.classList.remove('bg-indigo-600', 'text-white');
      btn.classList.add('text-slate-400');
    }
  });
  renderAlarmTiles();
}

function toggleAlarmSwitch(alarmId, isChecked) {
  audio.playSwitchPop(isChecked);
  const alarm = appState.alarms.find(a => a.id === alarmId);
  if (alarm) {
    alarm.enabled = isChecked;
    saveAlarmsState();
    renderAlarmTiles();
    showToast(isChecked ? 'Alarm activated' : 'Alarm disabled');
  }
}

function toggleAlarmDay(alarmId, dayIndex) {
  audio.playUiClick();
  const alarm = appState.alarms.find(a => a.id === alarmId);
  if (alarm) {
    if (alarm.days.includes(dayIndex)) {
      alarm.days = alarm.days.filter(d => d !== dayIndex);
    } else {
      alarm.days.push(dayIndex);
      alarm.days.sort((a, b) => a - b);
    }
    saveAlarmsState();
    renderAlarmTiles();
  }
}

function deleteAlarm(alarmId) {
  audio.playUiClick();
  appState.alarms = appState.alarms.filter(a => a.id !== alarmId);
  saveAlarmsState();
  renderAlarmTiles();
  showToast('Alarm deleted');
}

function previewAlarmRingtone(soundName) {
  audio.playUiClick();
  audio.playMelody(soundName);
}

// Add / Edit Alarm Modal Handlers
let modalSelectedDays = [1, 2, 3, 4, 5];
let modalAmPm = 'AM';

function openAlarmModal(alarmToEdit = null) {
  audio.playUiClick();
  const modal = document.getElementById('modal-alarm');
  const title = document.getElementById('modal-alarm-title');
  const hourInput = document.getElementById('modal-alarm-hour');
  const minuteInput = document.getElementById('modal-alarm-minute');
  const labelInput = document.getElementById('modal-alarm-label');
  const soundSelect = document.getElementById('modal-alarm-sound');
  const gentleWakeCheck = document.getElementById('modal-gentle-wake');

  if (alarmToEdit) {
    appState.editingAlarmId = alarmToEdit.id;
    if (title) title.textContent = 'Edit Alarm';
    if (hourInput) hourInput.value = String(alarmToEdit.hour).padStart(2, '0');
    if (minuteInput) minuteInput.value = String(alarmToEdit.minute).padStart(2, '0');
    if (labelInput) labelInput.value = alarmToEdit.label || '';
    if (soundSelect) soundSelect.value = alarmToEdit.sound || 'chime';
    if (gentleWakeCheck) gentleWakeCheck.checked = alarmToEdit.gentleWake !== false;
    modalSelectedDays = [...alarmToEdit.days];
    setModalAmPm(alarmToEdit.period);
  } else {
    appState.editingAlarmId = null;
    if (title) title.textContent = 'Create New Alarm';
    if (hourInput) hourInput.value = '07';
    if (minuteInput) minuteInput.value = '00';
    if (labelInput) labelInput.value = 'Morning Routine 🌅';
    if (soundSelect) soundSelect.value = 'chime';
    if (gentleWakeCheck) gentleWakeCheck.checked = true;
    modalSelectedDays = [1, 2, 3, 4, 5];
    setModalAmPm('AM');
  }

  updateModalDaysDisplay();
  if (modal) modal.classList.remove('hidden');
}

function closeAlarmModal() {
  const modal = document.getElementById('modal-alarm');
  if (modal) modal.classList.add('hidden');
  appState.editingAlarmId = null;
}

function setModalAmPm(val) {
  modalAmPm = val;
  const amBtn = document.getElementById('modal-ampm-am');
  const pmBtn = document.getElementById('modal-ampm-pm');
  if (val === 'AM') {
    amBtn.classList.add('bg-indigo-600', 'text-white');
    amBtn.classList.remove('bg-white/5', 'text-slate-400');
    pmBtn.classList.remove('bg-indigo-600', 'text-white');
    pmBtn.classList.add('bg-white/5', 'text-slate-400');
  } else {
    pmBtn.classList.add('bg-indigo-600', 'text-white');
    pmBtn.classList.remove('bg-white/5', 'text-slate-400');
    amBtn.classList.remove('bg-indigo-600', 'text-white');
    amBtn.classList.add('bg-white/5', 'text-slate-400');
  }
}

function bumpModalHour(step) {
  audio.playUiClick();
  const input = document.getElementById('modal-alarm-hour');
  let val = parseInt(input.value) || 12;
  val = ((val - 1 + step + 12) % 12) + 1;
  input.value = String(val).padStart(2, '0');
}

function bumpModalMinute(step) {
  audio.playUiClick();
  const input = document.getElementById('modal-alarm-minute');
  let val = parseInt(input.value) || 0;
  val = (val + step + 60) % 60;
  input.value = String(val).padStart(2, '0');
}

function setModalTime(h, m, p) {
  audio.playUiClick();
  document.getElementById('modal-alarm-hour').value = String(h).padStart(2, '0');
  document.getElementById('modal-alarm-minute').value = String(m).padStart(2, '0');
  setModalAmPm(p);
}

function setModalLabelPreset(lbl) {
  audio.playUiClick();
  document.getElementById('modal-alarm-label').value = lbl;
}

function toggleModalDay(day) {
  audio.playUiClick();
  if (modalSelectedDays.includes(day)) {
    modalSelectedDays = modalSelectedDays.filter(d => d !== day);
  } else {
    modalSelectedDays.push(day);
    modalSelectedDays.sort((a, b) => a - b);
  }
  updateModalDaysDisplay();
}

function setModalDaysPreset(type) {
  audio.playUiClick();
  if (type === 'weekdays') modalSelectedDays = [1, 2, 3, 4, 5];
  else if (type === 'all') modalSelectedDays = [0, 1, 2, 3, 4, 5, 6];
  updateModalDaysDisplay();
}

function updateModalDaysDisplay() {
  document.querySelectorAll('.modal-day').forEach(el => {
    const day = parseInt(el.dataset.day);
    if (modalSelectedDays.includes(day)) {
      el.classList.add('active');
      el.classList.remove('inactive');
    } else {
      el.classList.remove('active');
      el.classList.add('inactive');
    }
  });
}

function previewCurrentModalSound() {
  const sound = document.getElementById('modal-alarm-sound').value;
  audio.playMelody(sound);
}

function saveAlarmFromModal() {
  audio.playUiClick();
  const hour = parseInt(document.getElementById('modal-alarm-hour').value) || 7;
  const minute = parseInt(document.getElementById('modal-alarm-minute').value) || 0;
  const label = document.getElementById('modal-alarm-label').value.trim() || 'Alarm';
  const sound = document.getElementById('modal-alarm-sound').value;
  const gentleWake = document.getElementById('modal-gentle-wake').checked;

  if (appState.editingAlarmId) {
    const alarm = appState.alarms.find(a => a.id === appState.editingAlarmId);
    if (alarm) {
      alarm.hour = hour;
      alarm.minute = minute;
      alarm.period = modalAmPm;
      alarm.label = label;
      alarm.sound = sound;
      alarm.gentleWake = gentleWake;
      alarm.days = modalSelectedDays.length ? modalSelectedDays : [0, 1, 2, 3, 4, 5, 6];
      alarm.enabled = true;
    }
  } else {
    const newAlarm = {
      id: 'alm-' + Date.now(),
      hour,
      minute,
      period: modalAmPm,
      label,
      enabled: true,
      days: modalSelectedDays.length ? modalSelectedDays : [0, 1, 2, 3, 4, 5, 6],
      sound,
      gentleWake,
      snoozeMinutes: 5,
    };
    appState.alarms.unshift(newAlarm);
  }

  saveAlarmsState();
  closeAlarmModal();
  renderAlarmTiles();
  showToast('Alarm saved successfully!');
}

function editAlarm(alarmId) {
  const alarm = appState.alarms.find(a => a.id === alarmId);
  if (alarm) openAlarmModal(alarm);
}

// Check Alarms trigger
function checkActiveAlarms(now) {
  const currentHour24 = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay();

  appState.alarms.forEach(alarm => {
    if (!alarm.enabled) return;

    let alarmH24 = alarm.hour;
    if (alarm.period === 'PM' && alarm.hour < 12) alarmH24 += 12;
    if (alarm.period === 'AM' && alarm.hour === 12) alarmH24 = 0;

    if (alarmH24 === currentHour24 && alarm.minute === currentMinute) {
      if (alarm.days.includes(currentDay)) {
        triggerAlarmModal(alarm);
      }
    }
  });
}

function triggerAlarmModal(alarm) {
  appState.activeRingingAlarm = alarm;
  const modal = document.getElementById('modal-alarm-ringer');
  const timeEl = document.getElementById('ringer-time');
  const labelEl = document.getElementById('ringer-label');

  if (timeEl) {
    const h = String(alarm.hour).padStart(2, '0');
    const m = String(alarm.minute).padStart(2, '0');
    timeEl.textContent = `${h}:${m} ${alarm.period}`;
  }
  if (labelEl) labelEl.textContent = alarm.label || 'Alarm';

  if (modal) modal.classList.remove('hidden');

  // Start Web Audio continuous ring
  audio.startAlarm(alarm.sound || 'chime');

  // Trigger celebratory confetti
  if (typeof confetti === 'function') {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  }
}

function testAlarmRinger(alarmId) {
  const alarm = appState.alarms.find(a => a.id === alarmId);
  if (alarm) triggerAlarmModal(alarm);
}

function dismissAlarm() {
  audio.playUiClick();
  audio.stopAlarm();
  const modal = document.getElementById('modal-alarm-ringer');
  if (modal) modal.classList.add('hidden');
  appState.activeRingingAlarm = null;
  showToast('Alarm dismissed');
}

function snoozeAlarm(mins = 5) {
  audio.playUiClick();
  audio.stopAlarm();
  const modal = document.getElementById('modal-alarm-ringer');
  if (modal) modal.classList.add('hidden');

  showToast(`Snoozed for ${mins} minutes 💤`);
  setTimeout(() => {
    if (appState.activeRingingAlarm) {
      triggerAlarmModal(appState.activeRingingAlarm);
    }
  }, mins * 60 * 1000);
}

// ============================================================================
// 6. STOPWATCH ENGINE
// ============================================================================
function toggleStopwatch() {
  audio.playUiClick();
  const sw = appState.stopwatch;
  const playBtn = document.getElementById('btn-sw-toggle');
  const playIcon = document.getElementById('sw-play-icon');
  const resetBtn = document.getElementById('btn-sw-reset');
  const lapBtn = document.getElementById('btn-sw-lap');

  if (!sw.isRunning) {
    // START
    sw.isRunning = true;
    sw.startTime = performance.now() - sw.elapsedTime;
    sw.lapStartTime = performance.now() - sw.lapElapsedTime;

    if (playBtn) {
      playBtn.classList.remove('from-indigo-600', 'to-indigo-400');
      playBtn.classList.add('from-amber-600', 'to-amber-500');
    }
    if (playIcon) {
      playIcon.setAttribute('data-lucide', 'pause');
      playIcon.classList.remove('ml-1');
      lucide.createIcons();
    }
    if (resetBtn) resetBtn.disabled = true;
    if (lapBtn) lapBtn.disabled = false;

    sw.animFrame = requestAnimationFrame(updateStopwatchLoop);
  } else {
    // PAUSE
    sw.isRunning = false;
    cancelAnimationFrame(sw.animFrame);

    if (playBtn) {
      playBtn.classList.remove('from-amber-600', 'to-amber-500');
      playBtn.classList.add('from-indigo-600', 'to-indigo-400');
    }
    if (playIcon) {
      playIcon.setAttribute('data-lucide', 'play');
      playIcon.classList.add('ml-1');
      lucide.createIcons();
    }
    if (resetBtn) resetBtn.disabled = false;
    if (lapBtn) lapBtn.disabled = true;
  }
}

function updateStopwatchLoop() {
  const sw = appState.stopwatch;
  if (!sw.isRunning) return;

  const now = performance.now();
  sw.elapsedTime = now - sw.startTime;
  sw.lapElapsedTime = now - sw.lapStartTime;

  renderStopwatchDisplay(sw.elapsedTime, sw.lapElapsedTime);
  sw.animFrame = requestAnimationFrame(updateStopwatchLoop);
}

function renderStopwatchDisplay(elapsedMs, lapMs) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((elapsedMs % 1000) / 10);

  const minEl = document.getElementById('sw-min');
  const secEl = document.getElementById('sw-sec');
  const msEl = document.getElementById('sw-ms');

  if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
  if (secEl) secEl.textContent = String(seconds).padStart(2, '0');
  if (msEl) msEl.textContent = String(hundredths).padStart(2, '0');

  // Outer sweep ring (60 second cycle, circumference = 2 * PI * 105 = 659.73)
  const sweepRing = document.getElementById('stopwatch-sweep-ring');
  if (sweepRing) {
    const secFraction = (elapsedMs % 60000) / 60000;
    const offset = 659.73 * (1 - secFraction);
    sweepRing.style.strokeDashoffset = offset;
  }

  // Inner lap ring (60 second cycle, circumference = 2 * PI * 88 = 552.92)
  const lapRing = document.getElementById('stopwatch-lap-ring');
  if (lapRing) {
    const lapFraction = (lapMs % 60000) / 60000;
    const offset = 552.92 * (1 - lapFraction);
    lapRing.style.strokeDashoffset = offset;
  }
}

function recordStopwatchLap() {
  audio.playUiClick();
  const sw = appState.stopwatch;
  if (!sw.isRunning) return;

  const lapTime = sw.lapElapsedTime;
  const splitTime = sw.elapsedTime;
  const lapNumber = sw.laps.length + 1;

  sw.laps.unshift({
    lapNumber,
    lapTime,
    splitTime,
  });

  // Reset lap timer
  sw.lapStartTime = performance.now();
  sw.lapElapsedTime = 0;

  renderLapsList();
}

function resetStopwatch() {
  audio.playUiClick();
  const sw = appState.stopwatch;
  sw.isRunning = false;
  cancelAnimationFrame(sw.animFrame);
  sw.elapsedTime = 0;
  sw.lapElapsedTime = 0;
  sw.laps = [];

  renderStopwatchDisplay(0, 0);

  const resetBtn = document.getElementById('btn-sw-reset');
  const lapBtn = document.getElementById('btn-sw-lap');
  const lapBadge = document.getElementById('sw-lap-delta-badge');
  const lapCountBadge = document.getElementById('lap-count-badge');
  const lapsContainer = document.getElementById('laps-list');

  if (resetBtn) resetBtn.disabled = true;
  if (lapBtn) lapBtn.disabled = true;
  if (lapBadge) lapBadge.textContent = 'Lap 1: 00:00.00';
  if (lapCountBadge) lapCountBadge.textContent = '0 laps';
  if (lapsContainer) {
    lapsContainer.innerHTML = '<p class="text-sm text-slate-500 text-center py-6">No laps recorded yet. Start the stopwatch and tap "Lap" to record splits.</p>';
  }
}

function formatStopwatchTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
}

function renderLapsList() {
  const sw = appState.stopwatch;
  const container = document.getElementById('laps-list');
  const countBadge = document.getElementById('lap-count-badge');
  if (!container) return;

  if (countBadge) countBadge.textContent = `${sw.laps.length} laps`;

  // Find fastest and slowest lap (if > 1 lap)
  let fastestLapIndex = -1;
  let slowestLapIndex = -1;
  if (sw.laps.length > 1) {
    let min = Infinity;
    let max = -Infinity;
    sw.laps.forEach((lap, idx) => {
      if (lap.lapTime < min) { min = lap.lapTime; fastestLapIndex = idx; }
      if (lap.lapTime > max) { max = lap.lapTime; slowestLapIndex = idx; }
    });
  }

  container.innerHTML = sw.laps.map((lap, idx) => {
    const isFastest = idx === fastestLapIndex;
    const isSlowest = idx === slowestLapIndex;

    let badge = '';
    if (isFastest) {
      badge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">⚡ Fastest</span>';
    } else if (isSlowest) {
      badge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">🐢 Slowest</span>';
    }

    return `
      <div class="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/5 transition-colors font-mono">
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-400 w-8">#${String(lap.lapNumber).padStart(2, '0')}</span>
          ${badge}
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-white">${formatStopwatchTime(lap.lapTime)}</div>
          <div class="text-[11px] text-slate-500">Split: ${formatStopwatchTime(lap.splitTime)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function exportLaps() {
  audio.playUiClick();
  const sw = appState.stopwatch;
  if (sw.laps.length === 0) {
    showToast('No laps to copy');
    return;
  }
  const text = sw.laps.map(l => `Lap ${l.lapNumber}: ${formatStopwatchTime(l.lapTime)} (Total: ${formatStopwatchTime(l.splitTime)})`).reverse().join('\n');
  navigator.clipboard.writeText(text);
  showToast('Lap history copied to clipboard! 📋');
}

// ============================================================================
// 7. TIMERS ENGINE (MULTI-TIMER)
// ============================================================================
let timerInterval = null;

function initTimersLoop() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    let hasRunning = false;
    appState.timers.forEach(t => {
      if (t.isRunning && t.remainingSeconds > 0) {
        t.remainingSeconds -= 1;
        hasRunning = true;

        if (t.remainingSeconds <= 0) {
          t.isRunning = false;
          triggerTimerDone(t);
        }
      }
    });

    if (hasRunning) {
      renderTimers();
      updateDynamicIsland();
    }
  }, 1000);
}

function renderTimers() {
  const container = document.getElementById('active-timers-grid');
  const timerBadge = document.getElementById('tab-timer-badge');
  if (!container) return;

  const runningCount = appState.timers.filter(t => t.isRunning).length;
  if (timerBadge) {
    if (runningCount > 0) timerBadge.classList.remove('hidden');
    else timerBadge.classList.add('hidden');
  }

  container.innerHTML = appState.timers.map(timer => {
    const hours = Math.floor(timer.remainingSeconds / 3600);
    const minutes = Math.floor((timer.remainingSeconds % 3600) / 60);
    const seconds = timer.remainingSeconds % 60;

    let timeString = '';
    if (hours > 0) {
      timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Circular progress: radius 70, circumference = 2 * PI * 70 = 439.82
    const fraction = timer.totalSeconds > 0 ? timer.remainingSeconds / timer.totalSeconds : 0;
    const dashOffset = 439.82 * (1 - fraction);

    return `
      <div class="tactile-card glass-panel rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-between relative group">
        
        <!-- Header -->
        <div class="w-full flex items-center justify-between">
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
            ${timer.label || 'Timer'}
          </span>
          <button onclick="deleteTimer('${timer.id}')" class="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Circular Countdown Gauge -->
        <div class="relative w-48 h-48 my-3 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.06)" stroke-width="8" fill="transparent"/>
            <circle cx="80" cy="80" r="70" stroke="var(--primary)" stroke-width="8" stroke-linecap="round" fill="transparent"
                    stroke-dasharray="439.82" stroke-dashoffset="${dashOffset}" class="transition-all duration-300"/>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight font-mono-numbers">
              ${timeString}
            </span>
            <span class="text-[11px] text-slate-400 font-mono mt-1">
              ${timer.isRunning ? 'Active' : (timer.remainingSeconds === 0 ? 'Done' : 'Paused')}
            </span>
          </div>
        </div>

        <!-- Controls: +1m bump, Pause/Play, Reset -->
        <div class="flex items-center gap-2 pt-2">
          <button onclick="bumpTimerMinute('${timer.id}', 60)" class="tactile-btn text-xs font-bold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10">
            +1 min
          </button>
          <button onclick="toggleTimerState('${timer.id}')" class="tactile-btn px-5 py-2 rounded-xl ${timer.isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'} text-white font-bold text-xs shadow-lg">
            ${timer.isRunning ? 'Pause' : 'Start'}
          </button>
          <button onclick="resetTimer('${timer.id}')" class="tactile-btn p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10" title="Reset">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          </button>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function startQuickTimer(seconds, label) {
  audio.playUiClick();
  const newTimer = {
    id: 'timer-' + Date.now(),
    label,
    totalSeconds: seconds,
    remainingSeconds: seconds,
    isRunning: true,
    sound: 'chime',
  };
  appState.timers.unshift(newTimer);
  renderTimers();
  updateDynamicIsland();
  showToast(`Started "${label}" timer`);
}

function toggleTimerState(timerId) {
  audio.playUiClick();
  const timer = appState.timers.find(t => t.id === timerId);
  if (timer) {
    timer.isRunning = !timer.isRunning;
    renderTimers();
    updateDynamicIsland();
  }
}

function bumpTimerMinute(timerId, seconds) {
  audio.playUiClick();
  const timer = appState.timers.find(t => t.id === timerId);
  if (timer) {
    timer.remainingSeconds += seconds;
    timer.totalSeconds += seconds;
    renderTimers();
  }
}

function resetTimer(timerId) {
  audio.playUiClick();
  const timer = appState.timers.find(t => t.id === timerId);
  if (timer) {
    timer.isRunning = false;
    timer.remainingSeconds = timer.totalSeconds;
    renderTimers();
    updateDynamicIsland();
  }
}

function deleteTimer(timerId) {
  audio.playUiClick();
  appState.timers = appState.timers.filter(t => t.id !== timerId);
  renderTimers();
  updateDynamicIsland();
  showToast('Timer deleted');
}

function openAddTimerModal() {
  audio.playUiClick();
  const modal = document.getElementById('modal-add-timer');
  if (modal) modal.classList.remove('hidden');
}

function closeAddTimerModal() {
  const modal = document.getElementById('modal-add-timer');
  if (modal) modal.classList.add('hidden');
}

function createCustomTimerFromModal() {
  audio.playUiClick();
  const hours = parseInt(document.getElementById('timer-input-hours').value) || 0;
  const minutes = parseInt(document.getElementById('timer-input-minutes').value) || 0;
  const seconds = parseInt(document.getElementById('timer-input-seconds').value) || 0;
  const label = document.getElementById('timer-input-label').value.trim() || 'Custom Timer';

  const total = hours * 3600 + minutes * 60 + seconds;
  if (total <= 0) {
    showToast('Please set a valid duration');
    return;
  }

  const newTimer = {
    id: 'timer-' + Date.now(),
    label,
    totalSeconds: total,
    remainingSeconds: total,
    isRunning: true,
    sound: 'chime',
  };

  appState.timers.unshift(newTimer);
  closeAddTimerModal();
  renderTimers();
  updateDynamicIsland();
  showToast(`Started "${label}" timer`);
}

function triggerTimerDone(timer) {
  audio.playMelody('chime');
  showToast(`Timer "${timer.label}" Finished! 🔔`);
  if (typeof confetti === 'function') {
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  }
}

// Dynamic Floating Island
function updateDynamicIsland() {
  const island = document.getElementById('dynamic-island');
  const islandLabel = document.getElementById('island-label');
  const islandTime = document.getElementById('island-time');
  if (!island) return;

  const activeTimer = appState.timers.find(t => t.isRunning);
  const sw = appState.stopwatch;

  // Don't show island if user is already on that tab
  if (appState.currentTab === 'timers' && !sw.isRunning) {
    island.classList.add('hidden');
    return;
  }
  if (appState.currentTab === 'stopwatch' && !activeTimer) {
    island.classList.add('hidden');
    return;
  }

  if (activeTimer) {
    const mins = Math.floor(activeTimer.remainingSeconds / 60);
    const secs = activeTimer.remainingSeconds % 60;
    islandLabel.textContent = activeTimer.label;
    islandTime.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    island.classList.remove('hidden');
  } else if (sw.isRunning) {
    islandLabel.textContent = 'Stopwatch Running';
    islandTime.textContent = formatStopwatchTime(sw.elapsedTime);
    island.classList.remove('hidden');
  } else {
    island.classList.add('hidden');
  }
}

function jumpToActiveTimer() {
  audio.playUiClick();
  const activeTimer = appState.timers.find(t => t.isRunning);
  if (activeTimer) {
    switchTab('timers');
  } else if (appState.stopwatch.isRunning) {
    switchTab('stopwatch');
  }
}

// ============================================================================
// 8. SLEEP & CIRCADIAN AMBIENT SOUND ENGINE
// ============================================================================
function renderSleepCycles() {
  const container = document.getElementById('sleep-cycles-grid');
  if (!container) return;

  const now = new Date();
  // Average fall asleep time: 14 minutes
  const fallAsleepTime = new Date(now.getTime() + 14 * 60 * 1000);

  const cycles = [
    { cycles: 4, hours: 6, tag: 'Fair', desc: 'Short night rest' },
    { cycles: 5, hours: 7.5, tag: 'Optimal 🌟', desc: 'Recommended for peak energy' },
    { cycles: 6, hours: 9, tag: 'Deep Refresh', desc: 'Full restoration' },
  ];

  container.innerHTML = cycles.map(c => {
    const wakeDate = new Date(fallAsleepTime.getTime() + c.hours * 3600 * 1000);
    let h = wakeDate.getHours();
    const m = String(wakeDate.getMinutes()).padStart(2, '0');
    let p = '';
    if (!appState.is24Hour) {
      p = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
    }
    const hStr = String(h).padStart(2, '0');

    return `
      <div class="tactile-card glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${c.cycles === 5 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-slate-400'}">
            ${c.tag}
          </span>
          <span class="text-xs text-slate-400 font-mono">${c.cycles} cycles (${c.hours}h)</span>
        </div>

        <div>
          <div class="font-mono text-3xl font-black text-white font-mono-numbers">
            ${hStr}:${m} <span class="text-lg text-indigo-400">${p}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1">${c.desc}</p>
        </div>

        <button onclick="setAlarmFromSleepCycle(${wakeDate.getHours()}, ${wakeDate.getMinutes()})" 
                class="w-full tactile-btn py-2 rounded-xl bg-white/5 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 transition-colors">
          + Set Alarm for ${hStr}:${m} ${p}
        </button>
      </div>
    `;
  }).join('');
}

function setAlarmFromSleepCycle(hour24, minute) {
  audio.playUiClick();
  let period = 'AM';
  let hour = hour24;
  if (hour24 >= 12) {
    period = 'PM';
    if (hour24 > 12) hour = hour24 - 12;
  } else if (hour24 === 0) {
    hour = 12;
  }

  const newAlarm = {
    id: 'alm-' + Date.now(),
    hour,
    minute,
    period,
    label: 'Wake Up Refreshed 🌅',
    enabled: true,
    days: [0, 1, 2, 3, 4, 5, 6],
    sound: 'marimba',
    gentleWake: true,
    snoozeMinutes: 5,
  };

  appState.alarms.unshift(newAlarm);
  saveAlarmsState();
  showToast(`Alarm set for ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')} ${period}!`);
  switchTab('alarms');
}

function toggleAmbientSound(soundType) {
  audio.playUiClick();
  const stopBtn = document.getElementById('btn-ambient-stop');
  const cards = document.querySelectorAll('.ambient-sound-card');

  if (appState.ambient.activeType === soundType) {
    // Stop
    stopAmbientSound();
    return;
  }

  appState.ambient.activeType = soundType;
  audio.startAmbient(soundType);

  cards.forEach(card => {
    if (card.dataset.sound === soundType) {
      card.classList.add('bg-cyan-500/20', 'border-cyan-400/50', 'ring-2', 'ring-cyan-400/30');
      card.classList.remove('bg-white/5', 'border-white/10');
    } else {
      card.classList.remove('bg-cyan-500/20', 'border-cyan-400/50', 'ring-2', 'ring-cyan-400/30');
      card.classList.add('bg-white/5', 'border-white/10');
    }
  });

  if (stopBtn) stopBtn.classList.remove('hidden');
}

function stopAmbientSound() {
  audio.stopAmbient();
  appState.ambient.activeType = null;
  const stopBtn = document.getElementById('btn-ambient-stop');
  if (stopBtn) stopBtn.classList.add('hidden');

  document.querySelectorAll('.ambient-sound-card').forEach(card => {
    card.classList.remove('bg-cyan-500/20', 'border-cyan-400/50', 'ring-2', 'ring-cyan-400/30');
    card.classList.add('bg-white/5', 'border-white/10');
  });
}

function setAmbientVolume(val) {
  appState.ambient.volume = parseFloat(val);
  audio.setAmbientVolume(appState.ambient.volume);
}

function setAmbientSleepTimer(mins) {
  audio.playUiClick();
  if (appState.ambient.sleepTimerTimeout) {
    clearTimeout(appState.ambient.sleepTimerTimeout);
    appState.ambient.sleepTimerTimeout = null;
  }

  const label = document.getElementById('ambient-timer-label');
  if (mins === 0) {
    if (label) label.textContent = 'Off';
    showToast('Auto-stop timer cleared');
    return;
  }

  if (label) label.textContent = `${mins}m`;
  showToast(`Ambient audio will stop in ${mins} minutes`);

  appState.ambient.sleepTimerTimeout = setTimeout(() => {
    stopAmbientSound();
    if (label) label.textContent = 'Off';
    showToast('Ambient audio stopped');
  }, mins * 60 * 1000);
}

// ============================================================================
// 9. FULLSCREEN AMBIENT DESK / NIGHTSTAND MODE
// ============================================================================
function launchNightstandMode() {
  audio.playUiClick();
  const overlay = document.getElementById('ambient-nightstand-overlay');
  if (overlay) overlay.classList.remove('hidden');

  // Anti-burn-in shift: drift position slightly every 60s
  startBurnInProtection();
}

function exitNightstandMode() {
  audio.playUiClick();
  const overlay = document.getElementById('ambient-nightstand-overlay');
  if (overlay) overlay.classList.add('hidden');
}

let burnInInterval = null;
function startBurnInProtection() {
  if (burnInInterval) clearInterval(burnInInterval);
  burnInInterval = setInterval(() => {
    const el = document.getElementById('nightstand-drift-container');
    if (el) {
      const dx = (Math.random() - 0.5) * 16;
      const dy = (Math.random() - 0.5) * 16;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  }, 60000);
}

// ============================================================================
// 10. APP INITIALIZATION & EVENT LISTENERS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();

  // Initialize Analog SVG Clock Ticks
  initAnalogClockDial();

  // Render initial tabs
  renderWorldCities();
  renderAlarmTiles();
  renderTimers();
  renderSleepCycles();
  initTimersLoop();

  // Local Timezone Label
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzLabel = document.getElementById('local-tz-abbr');
    if (tzLabel) tzLabel.textContent = tz.split('/').pop().replace('_', ' ');
  } catch (e) {}

  // Live 60FPS clock update
  function liveTick() {
    updateLiveClock();
    requestAnimationFrame(liveTick);
  }
  requestAnimationFrame(liveTick);

  // Time format toggle button (12h / 24h)
  const formatBtn = document.getElementById('toggle-time-format');
  const formatLabel = document.getElementById('format-label');
  if (formatBtn) {
    if (formatLabel) formatLabel.textContent = appState.is24Hour ? '24H' : '12H';
    formatBtn.addEventListener('click', () => {
      audio.playUiClick();
      appState.is24Hour = !appState.is24Hour;
      localStorage.setItem('chronopulse_format', appState.is24Hour);
      if (formatLabel) formatLabel.textContent = appState.is24Hour ? '24H' : '12H';
      renderWorldCities();
      renderAlarmTiles();
      renderSleepCycles();
    });
  }

  // Sound FX toggle
  const soundBtn = document.getElementById('btn-toggle-sound');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      appState.soundEffects = !appState.soundEffects;
      localStorage.setItem('chronopulse_sound', appState.soundEffects);
      audio.playUiClick();
      if (soundIcon) {
        soundIcon.setAttribute('data-lucide', appState.soundEffects ? 'volume-2' : 'volume-x');
        lucide.createIcons();
      }
      showToast(appState.soundEffects ? 'Sound FX enabled' : 'Sound FX muted');
    });
  }

  // Theme dropdown toggle
  const themeMenuBtn = document.getElementById('btn-theme-menu');
  const themeDropdown = document.getElementById('theme-dropdown');
  if (themeMenuBtn && themeDropdown) {
    themeMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playUiClick();
      themeDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', () => {
      themeDropdown.classList.add('hidden');
    });
  }

  // Desk Mode trigger
  const nightstandBtn = document.getElementById('btn-nightstand');
  if (nightstandBtn) {
    nightstandBtn.addEventListener('click', launchNightstandMode);
  }

  // Time scrubber input
  const scrubberInput = document.getElementById('time-scrubber-slider');
  if (scrubberInput) {
    scrubberInput.addEventListener('input', (e) => {
      handleTimeScrubber(e.target.value);
    });
  }

  // Initialize Lucide icons
  lucide.createIcons();

  // First user interaction initializes Web Audio context
  window.addEventListener('click', () => audio.init(), { once: true });
  window.addEventListener('keydown', () => audio.init(), { once: true });
});
