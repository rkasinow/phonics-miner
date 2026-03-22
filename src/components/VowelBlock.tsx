import { type Vowel, VOWEL_INFO } from '../data/words';

interface VowelBlockProps {
  vowel: Vowel;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  highlight?: boolean;
  showLabel?: boolean;
}

const SIZES = {
  sm: 'w-16 h-16 text-lg',
  md: 'w-24 h-24 text-2xl',
  lg: 'w-32 h-32 text-4xl',
};

export default function VowelBlock({
  vowel,
  size = 'md',
  onClick,
  disabled = false,
  highlight = false,
  showLabel = true,
}: VowelBlockProps) {
  const info = VOWEL_INFO[vowel];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        block-btn ${SIZES[size]}
        flex flex-col items-center justify-center gap-1
        rounded-lg font-minecraft uppercase
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${highlight ? 'animate-sparkle ring-4 ring-white' : ''}
      `}
      style={{
        backgroundColor: info.color,
        borderTopColor: `${info.color}cc`,
        borderLeftColor: `${info.color}cc`,
        borderBottomColor: info.darkColor,
        borderRightColor: info.darkColor,
      }}
    >
      <span className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
        {vowel}
      </span>
      {showLabel && size !== 'sm' && (
        <span className="text-[8px] text-white/80">{info.ore}</span>
      )}
    </button>
  );
}
