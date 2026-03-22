interface XPBarProps {
  current: number;
  max: number;
  label?: string;
}

export default function XPBar({ current, max, label }: XPBarProps) {
  const pct = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto">
      {label && (
        <p className="text-white text-[10px] font-minecraft mb-1 text-center drop-shadow-[1px_1px_0_black]">
          {label}
        </p>
      )}
      <div className="h-6 bg-stone-dark border-2 border-black rounded-sm overflow-hidden relative">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: '#7EFC20',
            boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)',
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-minecraft text-white drop-shadow-[1px_1px_0_black]">
          {current}/{max}
        </span>
      </div>
    </div>
  );
}
