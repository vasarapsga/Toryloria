import { Plus, Play, Edit2, Trash2, ArrowLeft, Hammer } from 'lucide-react';
import { GameLevel, ViewState } from '../../types';
import { motion } from 'motion/react';
import { storage } from '../../storage';

interface GameBrowserProps {
  levels: GameLevel[];
  onNavigate: (view: ViewState) => void;
  onPlay: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function GameBrowser({ levels, onNavigate, onPlay, onEdit, onDelete }: GameBrowserProps) {
  const createNewLevel = () => {
    const newId = Math.random().toString(36).substring(7);
    const newLevel: GameLevel = {
      id: newId,
      name: `New World ${levels.length + 1}`,
      description: 'A brand new world waiting for your touch.',
      creator: 'You',
      type: 'sandbox',
      objects: [
        { id: 'spawn', x: 100, y: 100, width: 40, height: 40, type: 'spawn' }
      ],
      createdAt: Date.now()
    };
    storage.saveLevel(newLevel);
    onEdit(newId);
  };

  return (
    <div className="h-full bg-zinc-950 p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('menu')}
            className="p-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-2xl transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-zinc-400" />
          </button>
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Your Worlds</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Manage and play your creations</p>
          </div>
        </div>
        <button 
          onClick={createNewLevel}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-[20px] font-black uppercase tracking-tight transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-6 h-6" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 overflow-y-auto pr-4 custom-scrollbar pb-8">
        {levels.map((level) => (
          <motion.div
            layout
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col group shadow-xl"
          >
            <div className="h-40 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 p-2">
                 {level.objects.map(obj => (
                   <div key={obj.id} className="w-4 h-4 bg-white rounded-sm" />
                 ))}
               </div>
               <div className="z-10 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">
                 {level.type}
               </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-black mb-2 truncate uppercase italic tracking-tight">{level.name}</h3>
              <p className="text-zinc-500 text-sm font-medium line-clamp-2 mb-6 flex-1 leading-relaxed">
                {level.description}
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-zinc-800">
                <button 
                  onClick={() => onPlay(level.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/10"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Play
                </button>
                <button 
                  onClick={() => onEdit(level.id)}
                  className="p-3.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-2xl transition-all text-zinc-400 hover:text-white"
                  title="Edit Level"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onDelete(level.id)}
                  className="p-3.5 bg-zinc-800 border border-zinc-700 hover:bg-rose-500/10 rounded-2xl transition-all text-rose-500/60 hover:text-rose-500 hover:border-rose-500/50"
                  title="Delete Level"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {levels.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-[40px]">
            <Hammer className="w-20 h-20 mb-6 opacity-20" />
            <p className="text-xl font-black uppercase italic tracking-tight">Zero Worlds Detected</p>
            <p className="text-sm font-medium text-zinc-500 mt-1">Initialize your creativity by creating a new map.</p>
          </div>
        )}
      </div>
    </div>
  );
}
