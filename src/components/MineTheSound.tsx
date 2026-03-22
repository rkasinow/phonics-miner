import { useState, useCallback, useEffect } from 'react';
import VowelBlock from './VowelBlock';
import XPBar from './XPBar';
import BlockButton from './BlockButton';
import Celebration from './Celebration';
import { VOWELS, type Vowel, WORDS, type CVCWord, pickDistractorVowels } from '../data/words';
import { playWord, playCorrectSound, playWrongSound, playLevelUpSound } from '../utils/audio';

interface MineTheSoundProps {
  onBack: () => void;
}

const ROUNDS_PER_LEVEL = 5;
const TOTAL_ROUNDS = 10;

function pickQuestion(usedWords: string[]): { word: CVCWord; choices: Vowel[] } {
  const available = WORDS.filter(w => !usedWords.includes(w.word));
  const pool = available.length > 0 ? available : WORDS;
  const word = pool[Math.floor(Math.random() * pool.length)];
  const distractors = pickDistractorVowels(word.vowel, 2);
  const choices = [word.vowel, ...distractors].sort(() => Math.random() - 0.5);
  return { word, choices };
}

export default function MineTheSound({ onBack }: MineTheSoundProps) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [question, setQuestion] = useState(() => pickQuestion([]));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const nextQuestion = useCallback(() => {
    const newUsed = [...usedWords, question.word.word];
    setUsedWords(newUsed);
    setFeedback(null);

    if (round + 1 >= TOTAL_ROUNDS) {
      setGameOver(true);
      playLevelUpSound();
      return;
    }

    setRound(r => r + 1);
    setQuestion(pickQuestion(newUsed));
  }, [round, usedWords, question.word.word]);

  // Play the word on mount and when question changes
  useEffect(() => {
    if (!gameOver) {
      playWord(question.word.word);
    }
  }, [question.word.word, gameOver]);

  const handleChoice = async (vowel: Vowel) => {
    if (feedback) return;

    if (vowel === question.word.vowel) {
      setFeedback('correct');
      setScore(s => s + 1);
      playCorrectSound();

      if ((score + 1) % ROUNDS_PER_LEVEL === 0) {
        setShowCelebration(true);
      }

      setTimeout(nextQuestion, 1200);
    } else {
      setFeedback('wrong');
      playWrongSound();
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const handleReplay = () => {
    playWord(question.word.word);
  };

  const restart = () => {
    setScore(0);
    setRound(0);
    setUsedWords([]);
    setQuestion(pickQuestion([]));
    setFeedback(null);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
        <span className="text-6xl animate-float">🏆</span>
        <h2 className="text-xl text-white font-minecraft text-center drop-shadow-[2px_2px_0_black]">
          Amazing Mining!
        </h2>
        <p className="text-sm text-yellow-300 font-minecraft drop-shadow-[1px_1px_0_black]">
          You got {score} out of {TOTAL_ROUNDS}!
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

  return (
    <div className="flex flex-col items-center min-h-screen p-6 gap-6">
      <Celebration show={showCelebration} onDone={() => setShowCelebration(false)} />

      {/* Header */}
      <div className="flex items-center w-full max-w-lg">
        <BlockButton onClick={onBack} color="#7F7F7F" darkColor="#5F5F5F">
          ← Back
        </BlockButton>
        <h2 className="flex-1 text-center text-lg text-white font-minecraft drop-shadow-[2px_2px_0_black]">
          ⛏️ Mine the Sound
        </h2>
        <div className="w-20" />
      </div>

      <XPBar current={score} max={TOTAL_ROUNDS} label={`Round ${round + 1}/${TOTAL_ROUNDS}`} />

      {/* Word display */}
      <div className={`flex flex-col items-center gap-4 ${feedback === 'wrong' ? 'animate-shake' : ''}`}>
        <button
          onClick={handleReplay}
          className="block-btn w-40 h-40 rounded-xl flex flex-col items-center justify-center gap-2"
          style={{ backgroundColor: '#5F5F5F', borderColor: '#7F7F7F' }}
        >
          <span className="text-5xl">{question.word.emoji}</span>
          <span className="text-2xl">🔊</span>
        </button>

        <p className="text-[10px] text-white/80 font-minecraft drop-shadow-[1px_1px_0_black]">
          Tap to hear again! What's the middle sound?
        </p>
      </div>

      {/* Letter display showing consonant frame */}
      <div className="flex items-center gap-2">
        <span className="text-2xl text-white font-minecraft drop-shadow-[2px_2px_0_black]">
          {question.word.start}
        </span>
        <span className="text-2xl text-yellow-300 font-minecraft drop-shadow-[2px_2px_0_black]">
          ?
        </span>
        <span className="text-2xl text-white font-minecraft drop-shadow-[2px_2px_0_black]">
          {question.word.end}
        </span>
      </div>

      {/* Vowel choices */}
      <div className="flex gap-4">
        {question.choices.map(vowel => (
          <VowelBlock
            key={vowel}
            vowel={vowel}
            size="lg"
            onClick={() => handleChoice(vowel)}
            highlight={feedback === 'correct' && vowel === question.word.vowel}
            disabled={feedback === 'correct'}
          />
        ))}
      </div>

      {/* Feedback text */}
      {feedback === 'correct' && (
        <p className="text-sm text-xp-green font-minecraft animate-bounce-in drop-shadow-[1px_1px_0_black]">
          ✓ {question.word.word.toUpperCase()}! Great mining!
        </p>
      )}
      {feedback === 'wrong' && (
        <p className="text-sm text-red-400 font-minecraft animate-shake drop-shadow-[1px_1px_0_black]">
          Try again!
        </p>
      )}
    </div>
  );
}
