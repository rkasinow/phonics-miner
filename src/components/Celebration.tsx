import { useEffect, useState } from 'react';

interface CelebrationProps {
  show: boolean;
  onDone?: () => void;
}

const PARTICLES = ['⭐', '✨', '💎', '🟩', '🟨'];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export default function Celebration({ show, onDone }: CelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!show) {
      setParticles([]);
      return;
    }

    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: PARTICLES[Math.floor(Math.random() * PARTICLES.length)],
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      dx: (Math.random() - 0.5) * 60,
      dy: -20 - Math.random() * 40,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onDone?.();
    }, 1200);

    return () => clearTimeout(timer);
  }, [show, onDone]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-2xl"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: 'fall-in 1s ease-out forwards',
            transform: `translate(${p.dx}px, ${p.dy}px)`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
