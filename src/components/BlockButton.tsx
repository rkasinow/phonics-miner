import { type ReactNode } from 'react';

interface BlockButtonProps {
  children: ReactNode;
  onClick?: () => void;
  color?: string;
  darkColor?: string;
  className?: string;
  disabled?: boolean;
}

export default function BlockButton({
  children,
  onClick,
  color = '#8B6914',
  darkColor = '#6B4F10',
  className = '',
  disabled = false,
}: BlockButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        block-btn px-6 py-3 rounded-lg font-minecraft text-white
        text-sm drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        backgroundColor: color,
        borderTopColor: `${color}cc`,
        borderLeftColor: `${color}cc`,
        borderBottomColor: darkColor,
        borderRightColor: darkColor,
      }}
    >
      {children}
    </button>
  );
}
