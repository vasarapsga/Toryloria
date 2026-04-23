import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { ArrowLeft, Save, Square, Flag, Trash2, Zap, Layout, Settings, Box } from 'lucide-react';
import { GameLevel, GameObject, GameObjectType } from '../../types';
import { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants';
import { storage } from '../../storage';
import { motion } from 'motion/react';

interface GameEditorProps {
  levelId?: string;
  onSave: (level: GameLevel) => void;
  onBack: () => void;
}

const OBJECT_TYPES: { type: GameObjectType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'block', label: 'Solid Block', icon: <Square />, color: '#64748b' },
  { type: 'spawn', label: 'Spawn Point', icon: <Zap />, color: '#3b82f6' },
  { type: 'goal', label: 'Goal Flag', icon: <Flag />, color: '#10b981' },
  { type: 'lava', label: 'Danger (Lava)', icon: <Trash2 />, color: '#ef4444' },
];

export default function GameEditor({ levelId, onSave, onBack }: GameEditorProps) {
  const [level, setLevel] = useState<GameLevel>(() => {
    const existing = storage.getLevels().find(l => l.id === levelId);
    return existing || {
      id: levelId || Math.random().toString(36).substring(7),
      name: 'New World',
      description: 'A custom world.',
      creator: 'You',
      type: 'sandbox',
      objects: [],
      createdAt: Date.now()
    };
  });

  const [selectedType, setSelectedType] = useState<GameObjectType>('block');
  const [showSettings, setShowSettings] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw objects
    level.objects.forEach(obj => {
      const config = OBJECT_TYPES.find(t => t.type === obj.type);
      ctx.fillStyle = config?.color || '#ccc';
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      
      // Add symbol/detail
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
    });
  };

  useEffect(() => {
    draw();
  }, [level]);

  const handleCanvasClick = (e: MouseEvent) => {
    if (showSettings) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE) * GRID_SIZE;
    const y = Math.floor((e.clientY - rect.top) / GRID_SIZE) * GRID_SIZE;

    // Check if object exists at this position
    const existingIndex = level.objects.findIndex(o => o.x === x && o.y === y);

    if (existingIndex >= 0) {
      // Remove object
      const newObjects = [...level.objects];
      newObjects.splice(existingIndex, 1);
      setLevel({ ...level, objects: newObjects });
    } else {
      // Add object
      const newObj: GameObject = {
        id: Math.random().toString(36).substring(7),
        x,
        y,
        width: GRID_SIZE,
        height: GRID_SIZE,
        type: selectedType
      };
      
      // If spawn, only allow one
      if (selectedType === 'spawn') {
        const filtered = level.objects.filter(o => o.type !== 'spawn');
        setLevel({ ...level, objects: [...filtered, newObj] });
      } else {
        setLevel({ ...level, objects: [...level.objects, newObj] });
      }
    }
  };

  return (
    <div className="h-full bg-zinc-950 flex flex-col">
      {/* HUD Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-8 py-6 flex items-center justify-between shadow-2xl z-10">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-2xl transition-all shadow-lg active:scale-95">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <div>
            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1.5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
              Editor Protocol 0.9
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">{level.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-4 rounded-2xl transition-all border ${showSettings ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onSave(level)}
            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-2xl font-black uppercase tracking-tight transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Save className="w-5 h-5 font-bold" />
            Commit Changes
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Toolbar */}
        <div className="w-28 bg-zinc-900 border-r border-zinc-800 flex flex-col gap-6 p-6 items-center shadow-2xl">
          {OBJECT_TYPES.map(tool => (
            <button
              key={tool.type}
              onClick={() => setSelectedType(tool.type)}
              title={tool.label}
              className={`w-full aspect-square rounded-[24px] flex flex-col items-center justify-center gap-2 transition-all border-2 ${selectedType === tool.type ? 'bg-indigo-600/10 border-indigo-500 scale-105 shadow-xl shadow-indigo-500/5' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
            >
              <div className={selectedType === tool.type ? 'text-indigo-400' : 'text-zinc-500'}>{tool.icon}</div>
              <span className={`text-[8px] font-black uppercase leading-none tracking-widest ${selectedType === tool.type ? 'text-indigo-400' : 'text-zinc-600'}`}>{tool.type}</span>
            </button>
          ))}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-zinc-950 flex items-center justify-center p-20 cursor-crosshair custom-scrollbar">
           <div className="bg-zinc-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative border border-zinc-800/50 rounded-sm">
              <canvas 
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={handleCanvasClick}
                className="block"
              />
              {/* Tooltip Overlay */}
              <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md px-4 py-2 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 pointer-events-none flex items-center gap-2 shadow-xl">
                <Box className="w-3 h-3" />
                Active Unit: {selectedType}
              </div>
           </div>
        </div>

        {/* Settings Panel Overlay */}
        <motion.div 
           initial={false}
           animate={{ x: showSettings ? 0 : 400 }}
           transition={{ type: 'spring', damping: 25, stiffness: 200 }}
           className="absolute right-0 top-0 bottom-0 w-96 bg-zinc-900 border-l border-zinc-800 shadow-[0_0_100px_rgba(0,0,0,0.5)] p-10 z-20"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">Properties</h3>
            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 rotate-180 text-zinc-500" />
            </button>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
               <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Descriptor_Tag</label>
               <input 
                 className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 font-black uppercase tracking-tight focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                 value={level.name}
                 onChange={e => setLevel({...level, name: e.target.value})}
               />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Metadata_Brief</label>
               <textarea 
                 className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-indigo-500/50 h-32 resize-none custom-scrollbar leading-relaxed text-zinc-400"
                 value={level.description}
                 onChange={e => setLevel({...level, description: e.target.value})}
               />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Game_Logic_Model</label>
               <div className="grid grid-cols-3 gap-2">
                 {(['parkour', 'survival', 'sandbox'] as const).map(t => (
                   <button
                     key={t}
                     onClick={() => setLevel({...level, type: t})}
                     className={`py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${level.type === t ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/10' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                   >
                     {t}
                   </button>
                 ))}
               </div>
            </div>

            <div className="pt-10 border-t border-zinc-800/50 text-[9px] text-zinc-700 font-black uppercase tracking-[0.2em] leading-relaxed">
               UID: {level.id}
               <br />
               TIMESTAMPT: {new Date(level.createdAt).getTime()}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
