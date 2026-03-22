import { useState, useCallback, useEffect } from 'react';
import VowelBlock from './VowelBlock';
import XPBar from './XPBar';
import BlockButton from './BlockButton';
import Celebration from './Celebration';
import { VOWELS, type Vowel, WORDS, type CVCWord, pickDistractorVowels } from '../data/words';
import { playWord, playPhoneme, playCorrectSound, playWrongSound, playLevelUpSound } from '../utils/audio';

interface BuildTheWordProps {
  onBack: () => void;
}

const TOTAL_ROUNDS = 10;

function pickQuestion(usedWords: string[]): { word: CVCWord; choices: Vowel[] } {
  const available = WORDS.filter(w => !usedWords.includes(w.word));
  const pool = available.length > 0 ? available : WORDS;
  const word = pool[Math.floor(Math.random() * pool.length)];
  const distractors = pickDistractorVowels(word.vowel, 2);
  const choices = [word.vowel, ...distractors].sort(() => Math.random() - 0.5);
  return { word, choices };
}

export default function BuildTheWord({ onBack }: BuildTheWordProps) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [question, setQuestion] = useState(() => pickQuestion([]));
  const [selected, setSelected] = useState<Vowel | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      playWord(question.word.word);
    }
  }, [question.word.word, gameOver]);

  const nextQuestion = useCallback(() => {
    const newUsed = [...usedWords, question.word.word];
    setUsedWords(newUsed);
    setFeedback(null);
    setSelected(null);

    if (round + 1 >= TOTAL_ROUNDS) {
      setGameOver(true);
      playLevelUpSound();
      return;
    }

    setRound(r => r + 1);
    setQuestion(pickQuestion(newUsed));
  }, [round, usedWords, question.word.word]);

  const handleChoice = async (vowel: Vowel) => {
    if (feedback) return;
    setSelected(vowel);
    await playPhoneme(vowel);

    if (vowel === question.word.vowel) {
      setFeedback('correct');
      setScore(s => s + 1);
      playCorrectSound();

      if ((score + 1) % 5 === 0) {
        setShowCelebration(true);
      }

      setTimeout(() => {
        playWord(question.word.word);
        setTimeout(nextQuestion, 800);
      }, 600);
    } else {
      setFeedback('wrong');
      playWrongSound();
      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
      }, 800);
    }
  };

  const restart = () => {
    setScore(0);
    setRound(0);
    setUsedWords([]);
    setQuestion(pickQuestion([]));
    setFeedback(null);
    setSelected(null);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
        <span className="text-6xl animate-float">🏗️</span>
        <h2 className="text-xl text-white font-minecraft text-center drop-shadow-[2px_2px_0_black]">
          Amazing Builder!
        </h2>
        <p className="text-sm text-yellow-300 font-minecraft drop-shadow-[1px_1px_0_black]">
          You built {score} out of {TOTAL_ROUNDS} words!
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
          🧱 Build the Word
        </h2>
        <div className="w-20" />
      </div>

      <XPBar current={score} max={TOTAL_ROUNDS} label={`Round ${round + 1}/${TOTAL_ROUNDS}`} />

      {/* Picture + audio */}
      <button
        onClick={() => playWord(question.word.word)}
        className="block-btn w-32 h-32 rounded-xl flex flex-col items-center justify-center gap-2"
        style={{ backgroundColor: '#5F5F5F', borderColor: '#7F7F7F' }}
      >
        <span className="text-5xl">{question.word.emoji}</span>
        <span className="text-lg">🔊</span>
      </button>

      {/* Block slots: C _ C */}
      <div className={`flex items-center gap-3 ${feedback === 'wrong' ? 'animate-shake' : ''}`}>
        {/* Start consonant */}
        <div
          className="block-btn w-20 h-20 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#7F7F7F' }}
        >
          <span className="text-3xl text-white font-minecraft drop-shadow-[2px_2px_0_black]">
            {question.word.start}
          </span>
        </div>

        {/* Vowel slot */}
        <div
          className={`
            w-20 h-20 rounded-lg flex items-center justify-center
            border-4 border-dashed
            ${selected && feedback === 'correct' ? 'animate-bounce-in' : ''}
          `}
          style={{
            borderColor: selected ? '#7EFC20' : '#ffffff66',
            backgroundColor: selected ? '#ffffff22' : 'transparent',
          }}
        >
          {selected ? (
            <span
              className="text-3xl font-minecraft drop-shadow-[2px_2px_0_black]"
              style={{ color: feedback === 'correct' ? '#7EFC20' : '#FF6666' }}
            >
              {selected}
            </span>
          ) : (
            <span className="text-3xl text-white/30 font-minecraft">?</span>
          )}
        </div>

        {/* End consonant */}
        <div
          className="block-btn w-20 h-20 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#7F7F7F' }}
        >
          <span className="text-3xl text-white font-minecraft drop-shadow-[2px_2px_0_black]">
            {question.word.end}
          </span>
        </div>
      </div>

      <p className="text-[10px] text-white/80 font-minecraft drop-shadow-[1px_1px_0_black]">
        Pick the missing vowel block!
      </p>

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

      {feedback === 'correct' && (
        <p className="text-sm text-xp-green font-minecraft animate-bounce-in drop-shadow-[1px_1px_0_black]">
          ✓ {question.word.word.toUpperCase()}! Great building!
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
