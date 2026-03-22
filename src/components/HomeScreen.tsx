import BlockButton from './BlockButton';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6">
      {/* Title */}
      <div className="animate-float">
        <span className="text-6xl">⛏️</span>
      </div>

      <h1 className="text-2xl md:text-3xl text-white font-minecraft text-center leading-relaxed drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
        Phonics<br />Miner
      </h1>

      <p className="text-sm text-white/80 font-minecraft drop-shadow-[1px_1px_0_black]">
        Let's mine some sounds!
      </p>

      {/* Game mode buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <BlockButton
          color="#4AEDD9"
          darkColor="#38BBAA"
          onClick={() => onNavigate('explorer')}
        >
          🔊 Sound Explorer
        </BlockButton>

        <BlockButton
          color="#FF0000"
          darkColor="#CC0000"
          onClick={() => onNavigate('mine')}
        >
          ⛏️ Mine the Sound
        </BlockButton>

        <BlockButton
          color="#17DD62"
          darkColor="#12B04E"
          onClick={() => onNavigate('build')}
        >
          🧱 Build the Word
        </BlockButton>

        <BlockButton
          color="#FCDB05"
          darkColor="#D4B804"
          onClick={() => onNavigate('sort')}
          className="!text-black"
        >
          📦 Sound Sort
        </BlockButton>
      </div>
    </div>
  );
}
