import BlockButton from './BlockButton';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 relative overflow-hidden">
      {/* Background landscape */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 bg-cover bg-bottom pointer-events-none opacity-60"
        style={{
          backgroundImage: 'url(/images/background.png)',
        }}
      />

      {/* Character mascot */}
      <div className="animate-float relative z-10">
        <img
          src="/images/character.png"
          alt="Phonics Miner character"
          className="w-40 h-auto"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      <h1 className="text-2xl md:text-3xl text-white font-minecraft text-center leading-relaxed drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)] relative z-10">
        Phonics<br />Miner
      </h1>

      {/* Game mode buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs relative z-10">
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
