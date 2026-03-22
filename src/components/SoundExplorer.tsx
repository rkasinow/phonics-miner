import { useState } from 'react';
import VowelBlock from './VowelBlock';
import BlockButton from './BlockButton';
import { VOWELS, VOWEL_INFO, getWordsByVowel, type Vowel } from '../data/words';
import { playPhoneme, playWord } from '../utils/audio';

interface SoundExplorerProps {
  onBack: () => void;
}

export default function SoundExplorer({ onBack }: SoundExplorerProps) {
  const [activeVowel, setActiveVowel] = useState<Vowel | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const handleVowelTap = async (vowel: Vowel) => {
    setActiveVowel(vowel);
    await playPhoneme(vowel);
  };

  const handleWordTap = async (word: string) => {
    setPlayingWord(word);
    await playWord(word);
    setPlayingWord(null);
  };

  const words = activeVowel ? getWordsByVowel(activeVowel) : [];

  return (
    <div className="flex flex-col items-center min-h-screen p-6 gap-6">
      {/* Header */}
      <div className="flex items-center w-full max-w-lg">
        <BlockButton onClick={onBack} color="#7F7F7F" darkColor="#5F5F5F">
          ← Back
        </BlockButton>
        <h2 className="flex-1 text-center text-lg text-white font-minecraft drop-shadow-[2px_2px_0_black]">
          🔊 Sound Explorer
        </h2>
        <div className="w-20" /> {/* spacer */}
      </div>

      <p className="text-[10px] text-white/80 font-minecraft text-center drop-shadow-[1px_1px_0_black]">
        Tap a block to hear its sound!
      </p>

      {/* Vowel blocks */}
      <div className="flex flex-wrap justify-center gap-4">
        {VOWELS.map(vowel => (
          <VowelBlock
            key={vowel}
            vowel={vowel}
            size="lg"
            onClick={() => handleVowelTap(vowel)}
            highlight={activeVowel === vowel}
          />
        ))}
      </div>

      {/* Example words for selected vowel */}
      {activeVowel && (
        <div className="animate-bounce-in w-full max-w-lg">
          <p className="text-xs text-white font-minecraft text-center mb-3 drop-shadow-[1px_1px_0_black]">
            Words with "{activeVowel}" in the middle:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {words.slice(0, 6).map(w => (
              <button
                key={w.word}
                onClick={() => handleWordTap(w.word)}
                className={`
                  block-btn p-3 rounded-lg text-center
                  ${playingWord === w.word ? 'animate-sparkle' : ''}
                `}
                style={{
                  backgroundColor: VOWEL_INFO[activeVowel].color + '33',
                  borderColor: VOWEL_INFO[activeVowel].color,
                }}
              >
                <span className="text-3xl">{w.emoji}</span>
                <p className="text-white font-minecraft text-xs mt-1 drop-shadow-[1px_1px_0_black]">
                  {w.start}<span className="text-yellow-300">{w.vowel}</span>{w.end}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
