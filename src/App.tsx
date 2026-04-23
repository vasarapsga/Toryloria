/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ViewState, GameLevel, UserCharacter } from './types';
import { storage } from './storage';
import MainMenu from './components/screens/MainMenu';
import GameBrowser from './components/screens/GameBrowser';
import GameEditor from './components/screens/GameEditor';
import GamePlay from './components/screens/GamePlay';
import AvatarCustomizer from './components/screens/AvatarCustomizer';
import AuthScreen from './components/screens/AuthScreen';
import { AnimatePresence, motion } from 'motion/react';
import { User as UserType } from './types';

export default function App() {
  const [user, setUser] = useState<UserType | null>(storage.getSession());
  const [view, setView] = useState<ViewState>(user ? 'menu' : 'auth');
  const [levels, setLevels] = useState<GameLevel[]>([]);
  const [character, setCharacter] = useState<UserCharacter>(storage.getCharacter());
  const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>();

  useEffect(() => {
    setLevels(storage.getLevels());
  }, []);

  const handleLogin = (u: UserType) => {
    setUser(u);
    setView('menu');
  };

  const handleLogout = () => {
    storage.setSession(null);
    setUser(null);
    setView('auth');
  };

  const handleUpdateCharacter = (newChar: UserCharacter) => {
    setCharacter(newChar);
    storage.saveCharacter(newChar);
    if (user) {
      storage.saveUser({ ...user, character: newChar });
    }
  };

  const handleSaveLevel = (level: GameLevel) => {
    storage.saveLevel(level);
    setLevels(storage.getLevels());
  };

  const handleDeleteLevel = (id: string) => {
    storage.deleteLevel(id);
    setLevels(storage.getLevels());
  };

  const renderView = () => {
    if (!user && view !== 'auth') {
      setView('auth');
      return null;
    }

    switch (view) {
      case 'auth':
        return <AuthScreen onLogin={handleLogin} />;
      case 'menu':
        return <MainMenu onNavigate={setView} onLogout={handleLogout} />;
      case 'browser':
        return (
          <GameBrowser 
            levels={levels} 
            onNavigate={setView} 
            onPlay={(id) => {
              setSelectedLevelId(id);
              setView('play');
            }}
            onEdit={(id) => {
              setSelectedLevelId(id);
              setView('editor');
            }}
            onDelete={handleDeleteLevel}
          />
        );
      case 'editor':
        return (
          <GameEditor 
            levelId={selectedLevelId}
            onSave={handleSaveLevel}
            onBack={() => setView('browser')}
          />
        );
      case 'play': {
        const selectedLevel = levels.find(l => l.id === selectedLevelId);
        if (!selectedLevel) {
          setView('browser');
          return null;
        }
        return (
          <GamePlay 
            level={selectedLevel}
            character={character}
            onBack={() => setView('browser')}
          />
        );
      }
      case 'avatar':
      case 'shop':
        return (
          <AvatarCustomizer 
            character={character} 
            onUpdate={handleUpdateCharacter} 
            onBack={() => setView('menu')} 
          />
        );
      default:
        return <MainMenu onNavigate={setView} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="h-screen overflow-hidden"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

