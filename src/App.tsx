import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import SoundExplorer from './components/SoundExplorer';
import MineTheSound from './components/MineTheSound';
import BuildTheWord from './components/BuildTheWord';
import SoundSort from './components/SoundSort';

type Screen = 'home' | 'explorer' | 'mine' | 'build' | 'sort';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  const goHome = () => setScreen('home');

  switch (screen) {
    case 'explorer':
      return <SoundExplorer onBack={goHome} />;
    case 'mine':
      return <MineTheSound onBack={goHome} />;
    case 'build':
      return <BuildTheWord onBack={goHome} />;
    case 'sort':
      return <SoundSort onBack={goHome} />;
    default:
      return <HomeScreen onNavigate={(s) => setScreen(s as Screen)} />;
  }
}
