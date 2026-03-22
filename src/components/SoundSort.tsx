import { useState, useEffect, useCallback } from 'react';
import XPBar from './XPBar';
import BlockButton from './BlockButton';
import Celebration from './Celebration';
import { VOWEL_INFO, type Vowel, WORDS, type CVCWord } from '../data/words';
import { playWord, playCorrectSound, playWrongSound, playLevelUpSound } from '../utils/audio';

interface SoundSortProps {
  onBack: () => void;
}

const TOTAL_ROUNDS = 10;

// Pick 2 vowels to sort between, then pick a word from one of them
function pickRound(usedWords: string[]): {
  word: CVCWord;
  vowelA: Vowel;
  vowelB: Vowel;
} {
  const vowelPairs: [Vowel, Vowel][] = [
    ['a', 'u'], ['a', 'o'], ['e', 'i'], ['o', 'u'], ['a', 'e'],
    ['i', 'o'], ['e', 'u'], ['a', 'i'], ['e', 'o'], ['i', 'u'],
  ];
  const pair = vowelPairs[Math.floor(Math.random() * vowelPairs.length)];
  const [vowelA, vowelB] = pair;

  const available = WORDS.filter(
    w => (w.vowel === vowelA || w.vowel === vowelB) && !usedWords.includes(w.word)
  );
  const pool = available.length > 0
    ? available
    : WORDS.filter(w => w.vowel === vowelA || w.vowel === vowelB);

  const word = pool[Math.floor(Math.random() * pool.length)];
  return { word, vowelA, vowelB };
}

export default function SoundSort({ onBack }: SoundSortProps) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [question, setQuestion] = useState(() => pickRound([]));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      playWord(question.word.word);
    }
  }, [question.word.word, gameOver]);

  const nextRound = useCallback(() => {
    const newUsed = [...usedWords, question.word.word];
    setUsedWords(newUsed);
    setFeedback(null);

    if (round + 1 >= TOTAL_ROUNDS) {
      setGameOver(true);
      playLevelUpSound();
      return;
    }

    setRound(r => r + 1);
    setQuestion(pickRound(newUsed));
  }, [round, usedWords, question.word.word]);

  const handleSort = (vowel: Vowel) => {
    if (feedback) return;

    if (vowel === question.word.vowel) {
      setFeedback('correct');
      setScore(s => s + 1);
      playCorrectSound();

      if ((score + 1) % 5 === 0) {
        setShowCelebration(true);
      }

      setTimeout(nextRound, 1200);
    } else {
      setFeedback('wrong');
      playWrongSound();
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const restart = () => {
    setScore(0);
    setRound(0);
    setUsedWords([]);
    setQuestion(pickRound([]));
    setFeedback(null);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
        <span className="text-6xl animate-float">📦</span>
        <h2 className="text-xl text-white font-minecraft text-center drop-shadow-[2px_2px_0_black]">
          Super Sorter!
        </h2>
        <p className="text-sm text-yellow-300 font-minecraft drop-shadow-[1px_1px_0_black]">
          You sorted {score} out of {TOTAL_ROUNDS}!
        </p>
        <div className="flex gap-4">
          <BlockButton onClick={restart} color="#17DD62" darkColor="#12B04E">
            Play Again
          </BlockButton>
          <BlockButton onClick={onBack} color="#7F7F7F" darkColor="#5F5F5F">
            Home
          </BlockButton>
        </div>
      </div>
    );
  }

  const infoA = VOWEL_INFO[question.vowelA];
  const infoB = VOWEL_INFO[question.vowelB];

  return (
    <div className="flex flex-col items-center min-h-screen p-6 gap-6">
      <Celebration show={showCelebration} onDone={() => setShowCelebration(false)} />

      {/* Header */}
      <div className="flex items-center w-full max-w-lg">
        <BlockButton onClick={onBack} color="#7F7F7F" darkColor="#5F5F5F">
          ← Back
        </BlockButton>
        <h2 className="flex-1 text-center text-lg text-white font-minecraft drop-shadow-[2px_2px_0_black]">
          📦 Sound Sort
        </h2>
        <div className="w-20" />
      </div>

      <XPBar current={score} max={TOTAL_ROUNDS} label={`Round ${round + 1}/${TOTAL_ROUNDS}`} />

      {/* Falling word block */}
      <div className={`animate-fall-in ${feedback === 'wrong' ? 'animate-shake' : ''}`}>
        <button
          onClick={() => playWord(question.word.word)}
          className="block-btn w-36 h-36 rounded-xl flex flex-col items-center justify-center gap-2"
          style={{ backgroundColor: '#8B6914' }}
        >
          <span className="text-5xl">{question.word.emoji}</span>
          <p className="text-white font-minecraft text-xs drop-shadow-[1px_1px_0_black]">
            {question.word.start}
            <span className="text-yellow-300">?</span>
            {question.word.end}
          </p>
          <span className="text-lg">🔊</span>
        </button>
      </div>

      <p className="text-[10px] text-white/80 font-minecraft drop-shadow-[1px_1px_0_black]">
        Which chest does this word go in?
      </p>

      {/* Two chests to sort into */}
      <div className="flex gap-8">
        {[
          { vowel: question.vowelA, info: infoA },
          { vowel: question.vowelB, info: infoB },
        ].map(({ vowel, info }) => (
          <button
            key={vowel}
            onClick={() => handleSort(vowel)}
            disabled={feedback === 'correct'}
            className={`
              block-btn w-32 h-40 rounded-xl flex flex-col items-center justify-center gap-2
              ${feedback === 'correct' && vowel === question.word.vowel ? 'animate-bounce-in' : ''}
            `}
            style={{
              backgroundColor: info.color,
              borderTopColor: `${info.color}cc`,
              borderLeftColor: `${info.color}cc`,
              borderBottomColor: info.darkColor,
              borderRightColor: info.darkColor,
            }}
          >
            <span className="text-3xl">📦</span>
            <span className="text-3xl text-white font-minecraft drop-shadow-[2px_2px_0_black]">
              {vowel.toUpperCase()}
            </span>
            <span className="text-[8px] text-white/80 font-minecraft">
              {info.ore}
            </span>
          </button>
        ))}
      </div>

      {feedback === 'correct' && (
        <p className="text-sm text-xp-green font-minecraft animate-bounce-in drop-shadow-[1px_1px_0_black]">
          ✓ {question.word.word.toUpperCase()} goes in the {question.word.vowel.toUpperCase()} chest!
        </p>
      )}
      {feedback === 'wrong' && (
        <p className="text-sm text-red-400 font-minecraft animate-shake drop-shadow-[1px_1px_0_black]">
          Hmm, try the other chest!
        </p>
      )}
    </div>
  );
}
