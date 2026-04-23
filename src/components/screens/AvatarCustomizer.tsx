import { useState } from 'react';
import { ArrowLeft, Save, Palette, Shirt, Sliders, Zap } from 'lucide-react';
import { UserCharacter, ClothingItem } from '../../types';
import { CLOTHING_ITEMS } from '../../constants';
import CharacterPreview from '../player/CharacterPreview';
import { motion, AnimatePresence } from 'motion/react';

interface AvatarCustomizerProps {
  character: UserCharacter;
  onUpdate: (character: UserCharacter) => void;
  onBack: () => void;
}

export default function AvatarCustomizer({ character, onUpdate, onBack }: AvatarCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'clothing'>('appearance');
  const [localChar, setLocalChar] = useState<UserCharacter>(character);

  const colors = [
    '#e5e7eb', '#1f2937', '#ef4444', '#f97316', '#f59e0b', 
    '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'
  ];

  const handleEquip = (item: ClothingItem) => {
    setLocalChar(prev => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [item.type]: prev.equipped[item.type as keyof typeof prev.equipped] === item.id ? undefined : item.id
      }
    }));
  };

  const save = () => {
    onUpdate(localChar);
    onBack();
  };

  return (
    <div className="h-full bg-zinc-950 flex flex-col md:flex-row overflow-hidden p-8 gap-8">
      {/* Left: Preview */}
      <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-[40px] relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 p-8 flex flex-col h-full">
          <div className="w-full flex items-center justify-between mb-auto shrink-0">
            <button onClick={onBack} className="p-4 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-2xl transition-all shadow-lg active:scale-95">
              <ArrowLeft className="w-6 h-6 text-zinc-400" />
            </button>
            <div className="text-2xl font-black italic tracking-tighter uppercase">Avatar Hub</div>
            <button onClick={save} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-2xl font-black uppercase tracking-tight transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
              <Save className="w-5 h-5" />
              Store DNA
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-12">
              <CharacterPreview character={localChar} className="w-64 h-64 md:w-96 md:h-96" />
          </div>

          <div className="w-full max-w-sm mx-auto mt-auto shrink-0 pt-8 border-t border-zinc-800/50">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3">Identity Signature</label>
              <input 
                type="text" 
                value={localChar.nickname}
                onChange={e => setLocalChar(p => ({ ...p, nickname: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 font-black text-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all uppercase placeholder:text-zinc-800 tracking-tight"
                placeholder="UNIDENTIFIED_USER"
              />
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-full md:w-[480px] bg-zinc-900 border border-zinc-800 rounded-[40px] flex flex-col shadow-2xl overflow-hidden shrink-0">
        <div className="flex p-4 gap-2 bg-zinc-950/50 border-b border-zinc-800/50">
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'appearance' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:bg-zinc-800'}`}
          >
            <Palette className="w-4 h-4" />
            Bio
          </button>
          <button 
            onClick={() => setActiveTab('clothing')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'clothing' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:bg-zinc-800'}`}
          >
            <Shirt className="w-4 h-4" />
            Gear
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'appearance' ? (
              <motion.div 
                key="appearance"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-10"
              >
                <div>
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    Chroma Selection
                  </h4>
                  <div className="grid grid-cols-5 gap-4">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setLocalChar(p => ({ ...p, bodyColor: color }))}
                        className={`w-full aspect-square rounded-2xl transition-all border-4 ${localChar.bodyColor === color ? 'border-indigo-500 scale-110 shadow-xl' : 'border-black/20 hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    Scale Protocol
                  </h4>
                  <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800">
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.5" 
                      step="0.05" 
                      value={localChar.size}
                      onChange={e => setLocalChar(p => ({ ...p, size: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] font-black text-zinc-600 mt-4 uppercase tracking-widest">
                      <span>Min_Unit</span>
                      <span>Nominal</span>
                      <span>Max_Unit</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="clothing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12 pb-8"
              >
                <ClothingSection 
                  title="Head Hardware" 
                  items={CLOTHING_ITEMS.filter(i => i.type === 'hat')}
                  equippedId={localChar.equipped.hat}
                  onEquip={handleEquip}
                />
                <ClothingSection 
                  title="Torso Armor" 
                  items={CLOTHING_ITEMS.filter(i => i.type === 'shirt')}
                  equippedId={localChar.equipped.shirt}
                  onEquip={handleEquip}
                />
                <ClothingSection 
                  title="Lower Modules" 
                  items={CLOTHING_ITEMS.filter(i => i.type === 'pants')}
                  equippedId={localChar.equipped.pants}
                  onEquip={handleEquip}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ClothingSection({ title, items, equippedId, onEquip }: {
  title: string;
  items: ClothingItem[];
  equippedId?: string;
  onEquip: (item: ClothingItem) => void;
}) {
  return (
    <div>
      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onEquip(item)}
            className={`flex flex-col items-center gap-4 p-5 rounded-3xl border-2 transition-all shadow-lg ${equippedId === item.id ? 'bg-indigo-600/10 border-indigo-500 shadow-indigo-500/10' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
          >
            <div className="w-16 h-16 rounded-2xl shadow-inner border border-black/10 flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
               {equippedId === item.id && <Zap className="w-6 h-6 fill-current" />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest truncate w-full text-center text-zinc-400">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
