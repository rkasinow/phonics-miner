export type Vowel = 'a' | 'e' | 'i' | 'o' | 'u';

export interface CVCWord {
  word: string;
  vowel: Vowel;
  start: string;
  end: string;
  emoji: string;
}

export const VOWEL_INFO: Record<Vowel, { color: string; ore: string; darkColor: string }> = {
  a: { color: '#FF0000', darkColor: '#CC0000', ore: 'Redstone' },
  e: { color: '#17DD62', darkColor: '#12B04E', ore: 'Emerald' },
  i: { color: '#4AEDD9', darkColor: '#38BBAA', ore: 'Diamond' },
  o: { color: '#FCDB05', darkColor: '#D4B804', ore: 'Gold' },
  u: { color: '#345EC3', darkColor: '#2A4B9C', ore: 'Lapis' },
};

export const VOWELS: Vowel[] = ['a', 'e', 'i', 'o', 'u'];

export const WORDS: CVCWord[] = [
  // Short A
  { word: 'cat', vowel: 'a', start: 'c', end: 't', emoji: '🐱' },
  { word: 'hat', vowel: 'a', start: 'h', end: 't', emoji: '🎩' },
  { word: 'bat', vowel: 'a', start: 'b', end: 't', emoji: '🦇' },
  { word: 'map', vowel: 'a', start: 'm', end: 'p', emoji: '🗺️' },
  { word: 'pan', vowel: 'a', start: 'p', end: 'n', emoji: '🍳' },
  { word: 'van', vowel: 'a', start: 'v', end: 'n', emoji: '🚐' },
  { word: 'jam', vowel: 'a', start: 'j', end: 'm', emoji: '🍯' },
  { word: 'ram', vowel: 'a', start: 'r', end: 'm', emoji: '🐏' },

  // Short E
  { word: 'bed', vowel: 'e', start: 'b', end: 'd', emoji: '🛏️' },
  { word: 'hen', vowel: 'e', start: 'h', end: 'n', emoji: '🐔' },
  { word: 'net', vowel: 'e', start: 'n', end: 't', emoji: '🥅' },
  { word: 'jet', vowel: 'e', start: 'j', end: 't', emoji: '✈️' },
  { word: 'red', vowel: 'e', start: 'r', end: 'd', emoji: '🔴' },
  { word: 'pen', vowel: 'e', start: 'p', end: 'n', emoji: '🖊️' },
  { word: 'leg', vowel: 'e', start: 'l', end: 'g', emoji: '🦵' },
  { word: 'web', vowel: 'e', start: 'w', end: 'b', emoji: '🕸️' },

  // Short I
  { word: 'pig', vowel: 'i', start: 'p', end: 'g', emoji: '🐷' },
  { word: 'sit', vowel: 'i', start: 's', end: 't', emoji: '🪑' },
  { word: 'dig', vowel: 'i', start: 'd', end: 'g', emoji: '⛏️' },
  { word: 'hit', vowel: 'i', start: 'h', end: 't', emoji: '💥' },
  { word: 'pin', vowel: 'i', start: 'p', end: 'n', emoji: '📌' },
  { word: 'fin', vowel: 'i', start: 'f', end: 'n', emoji: '🦈' },
  { word: 'wig', vowel: 'i', start: 'w', end: 'g', emoji: '💇' },
  { word: 'bib', vowel: 'i', start: 'b', end: 'b', emoji: '👶' },

  // Short O
  { word: 'dog', vowel: 'o', start: 'd', end: 'g', emoji: '🐕' },
  { word: 'pot', vowel: 'o', start: 'p', end: 't', emoji: '🍲' },
  { word: 'log', vowel: 'o', start: 'l', end: 'g', emoji: '🪵' },
  { word: 'box', vowel: 'o', start: 'b', end: 'x', emoji: '📦' },
  { word: 'fox', vowel: 'o', start: 'f', end: 'x', emoji: '🦊' },
  { word: 'hop', vowel: 'o', start: 'h', end: 'p', emoji: '🐇' },
  { word: 'mop', vowel: 'o', start: 'm', end: 'p', emoji: '🧹' },
  { word: 'cob', vowel: 'o', start: 'c', end: 'b', emoji: '🌽' },

  // Short U
  { word: 'bug', vowel: 'u', start: 'b', end: 'g', emoji: '🐛' },
  { word: 'cup', vowel: 'u', start: 'c', end: 'p', emoji: '☕' },
  { word: 'sun', vowel: 'u', start: 's', end: 'n', emoji: '☀️' },
  { word: 'run', vowel: 'u', start: 'r', end: 'n', emoji: '🏃' },
  { word: 'hut', vowel: 'u', start: 'h', end: 't', emoji: '🛖' },
  { word: 'nut', vowel: 'u', start: 'n', end: 't', emoji: '🥜' },
  { word: 'bus', vowel: 'u', start: 'b', end: 's', emoji: '🚌' },
  { word: 'gum', vowel: 'u', start: 'g', end: 'm', emoji: '🫧' },
];

export function getWordsByVowel(vowel: Vowel): CVCWord[] {
  return WORDS.filter(w => w.vowel === vowel);
}

export function getRandomWords(count: number, exclude?: string[]): CVCWord[] {
  const available = exclude
    ? WORDS.filter(w => !exclude.includes(w.word))
    : [...WORDS];
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomWord(vowel?: Vowel): CVCWord {
  const pool = vowel ? getWordsByVowel(vowel) : WORDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickDistractorVowels(correct: Vowel, count: number): Vowel[] {
  const others = VOWELS.filter(v => v !== correct);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
