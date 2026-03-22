// Audio utility — uses pre-generated ElevenLabs files when available,
// falls back to Web Speech API for development/demo.

const audioCache = new Map<string, HTMLAudioElement>();

function getCachedAudio(path: string): HTMLAudioElement {
  if (!audioCache.has(path)) {
    audioCache.set(path, new Audio(path));
  }
  return audioCache.get(path)!;
}

function fileExists(path: string): Promise<boolean> {
  return fetch(path, { method: 'HEAD' })
    .then(r => r.ok)
    .catch(() => false);
}

// Try to play a pre-generated audio file, fall back to speech synthesis
async function playFile(path: string, fallbackText: string): Promise<void> {
  const exists = await fileExists(path);
  if (exists) {
    const audio = getCachedAudio(path);
    audio.currentTime = 0;
    return audio.play();
  }
  // Fallback to Web Speech API
  return speakText(fallbackText);
}

function speakText(text: string): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    speechSynthesis.speak(utterance);
  });
}

// Phoneme sounds for isolated vowels
const PHONEME_TEXT: Record<string, string> = {
  a: 'aah',
  e: 'eh',
  i: 'ih',
  o: 'oh',
  u: 'uh',
};

export async function playPhoneme(vowel: string): Promise<void> {
  return playFile(
    `/audio/phonemes/${vowel}.mp3`,
    PHONEME_TEXT[vowel] || vowel
  );
}

export async function playWord(word: string): Promise<void> {
  return playFile(`/audio/words/${word}.mp3`, word);
}

export async function playFeedback(type: 'pickup' | 'oof' | 'levelup'): Promise<void> {
  return playFile(`/audio/feedback/${type}.mp3`, '');
}

// Simple beep sounds as ultimate fallback for feedback
export function playBeep(frequency: number, duration: number): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = 'square'; // 8-bit sound
    gain.gain.value = 0.1;
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, duration);
  } catch {
    // Audio not supported
  }
}

export function playCorrectSound(): void {
  playFeedback('pickup').catch(() => {
    // Chain of rising beeps
    playBeep(440, 100);
    setTimeout(() => playBeep(554, 100), 120);
    setTimeout(() => playBeep(659, 150), 240);
  });
}

export function playWrongSound(): void {
  playFeedback('oof').catch(() => {
    playBeep(200, 200);
  });
}

export function playLevelUpSound(): void {
  playFeedback('levelup').catch(() => {
    playBeep(523, 100);
    setTimeout(() => playBeep(659, 100), 120);
    setTimeout(() => playBeep(784, 100), 240);
    setTimeout(() => playBeep(1047, 200), 360);
  });
}
