import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw, Monitor, Smartphone, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { GameLevel, UserCharacter, GameObject, ControlType } from '../../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE } from '../../constants';
import CharacterPreview from '../player/CharacterPreview';
import { motion, AnimatePresence } from 'motion/react';

interface GamePlayProps {
  level: GameLevel;
  character: UserCharacter;
  onBack: () => void;
}

interface PlayerStats {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
}

export default function GamePlay({ level, character, onBack }: GamePlayProps) {
  const [controlType, setControlType] = useState<ControlType | null>(null);
  const [player, setPlayer] = useState<PlayerStats>(() => {
    const spawnX = level.objects.find(o => o.type === 'spawn')?.x ?? 100;
    const spawnY = level.objects.find(o => o.type === 'spawn')?.y ?? 100;
    return {
      x: spawnX,
      y: spawnY,
      vx: 0,
      vy: 0,
      width: 40,
      height: 40,
      isGrounded: false
    };
  });

  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  const reset = useCallback(() => {
    const spawnX = level.objects.find(o => o.type === 'spawn')?.x ?? 100;
    const spawnY = level.objects.find(o => o.type === 'spawn')?.y ?? 100;
    setPlayer({
      x: spawnX,
      y: spawnY,
      vx: 0,
      vy: 0,
      width: 40,
      height: 40,
      isGrounded: false
    });
    setGameState('playing');
  }, [level]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const update = useCallback(() => {
    if (gameState !== 'playing' || !controlType) return;

    setPlayer(prev => {
      let nextVx = prev.vx;
      let nextVy = prev.vy;
      
      // Horizontal Movement
      const speed = 5;
      if (keys['KeyA'] || keys['ArrowLeft']) nextVx = -speed;
      else if (keys['KeyD'] || keys['ArrowRight']) nextVx = speed;
      else nextVx *= 0.8; // Friction

      // Gravity
      nextVy += 0.5;

      // Jump
      if ((keys['Space'] || keys['KeyW'] || keys['ArrowUp']) && prev.isGrounded) {
        nextVy = -10;
      }

      let nextX = prev.x + nextVx;
      let nextY = prev.y + nextVy;
      let isGrounded = false;

      // Collision Detection with Blocks
      for (const obj of level.objects) {
        if (obj.type === 'block') {
          // Check collision
          if (
            nextX < obj.x + obj.width &&
            nextX + prev.width > obj.x &&
            nextY < obj.y + obj.height &&
            nextY + prev.height > obj.y
          ) {
            // Resolve collision (simple version)
            // Vertical collision
            if (prev.y + prev.height <= obj.y) {
              nextY = obj.y - prev.height;
              nextVy = 0;
              isGrounded = true;
            } else if (prev.y >= obj.y + obj.height) {
              nextY = obj.y + obj.height;
              nextVy = 0;
            }
            // Horizontal collision
            if (prev.x + prev.width <= obj.x) {
                nextX = obj.x - prev.width;
                nextVx = 0;
            } else if (prev.x >= obj.x + obj.width) {
                nextX = obj.x + obj.width;
                nextVx = 0;
            }
          }
        } else if (obj.type === 'lava') {
             if (
                nextX < obj.x + obj.width &&
                nextX + prev.width > obj.x &&
                nextY < obj.y + obj.height &&
                nextY + prev.height > obj.y
              ) {
                setGameState('lost');
              }
        } else if (obj.type === 'goal') {
             if (
                nextX < obj.x + obj.width &&
                nextX + prev.width > obj.x &&
                nextY < obj.y + obj.height &&
                nextY + prev.height > obj.y
              ) {
                setGameState('won');
              }
        }
      }

      // World Boundaries
      if (nextX < 0) nextX = 0;
      if (nextX > CANVAS_WIDTH - prev.width) nextX = CANVAS_WIDTH - prev.width;
      if (nextY > CANVAS_HEIGHT - prev.height) {
        nextY = CANVAS_HEIGHT - prev.height;
        nextVy = 0;
        isGrounded = true;
      }
      if (nextY < 0) nextY = 0;

      return { ...prev, x: nextX, y: nextY, vx: nextVx, vy: nextVy, isGrounded };
    });

    requestRef.current = requestAnimationFrame(update);
  }, [keys, level, gameState]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [update]);

  // Render Background/Objects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#09090b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    level.objects.forEach(obj => {
      if (obj.type === 'spawn') return;
      
      let color = '#3f3f46';
      if (obj.type === 'lava') color = '#ef4444';
      if (obj.type === 'goal') color = '#10b981';
      
      ctx.fillStyle = color;
      ctx.shadowBlur = obj.type === 'lava' ? 15 : 0;
      ctx.shadowColor = color;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      ctx.shadowBlur = 0;
      
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
    });
  }, [level]);

  return (
    <div className="h-full bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between pointer-events-none z-20">
        <button 
          onClick={onBack} 
          className="pointer-events-auto p-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-2xl transition-all shadow-2xl backdrop-blur-md active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-zinc-400" />
        </button>
        <div className="bg-zinc-900 border border-zinc-800 px-8 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#4f46e2]"></div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Live_Session</div>
           </div>
           <div className="font-black text-xl italic uppercase tracking-tighter text-zinc-100">{level.name}</div>
        </div>
        <button 
          onClick={reset} 
          className="pointer-events-auto p-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-2xl transition-all shadow-2xl backdrop-blur-md active:scale-95 rotate-0 hover:rotate-180 duration-500"
        >
          <RefreshCw className="w-6 h-6 text-zinc-400" />
        </button>
      </div>

      {/* Game Stage */}
      <div className="relative shadow-[0_0_100px_rgba(79,70,229,0.1)] border-[6px] border-zinc-900 rounded-3xl overflow-hidden bg-zinc-900">
        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block"
        />

        {/* Control Choice Overlay */}
        <AnimatePresence>
          {!controlType && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-zinc-950/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="mb-12">
                 <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Select Protocol</h2>
                 <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Initialize your control interface</p>
              </div>

              <div className="flex gap-8 w-full max-w-2xl">
                 <button 
                   onClick={() => setControlType('pc')}
                   className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 hover:border-indigo-500 transition-all group flex flex-col items-center gap-6 shadow-2xl"
                 >
                    <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                       <Monitor className="w-10 h-10 text-zinc-400 group-hover:text-white" />
                    </div>
                    <div>
                       <span className="text-2xl font-black italic uppercase tracking-tight block">Stationary</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400">Desktop Protocol (WASD)</span>
                    </div>
                 </button>

                 <button 
                    onClick={() => setControlType('mobile')}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 hover:border-indigo-500 transition-all group flex flex-col items-center gap-6 shadow-2xl"
                 >
                    <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                       <Smartphone className="w-10 h-10 text-zinc-400 group-hover:text-white" />
                    </div>
                    <div>
                       <span className="text-2xl font-black italic uppercase tracking-tight block">Mobile</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400">Tactile Protocol (Touch)</span>
                    </div>
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Controls UI */}
        {controlType === 'mobile' && gameState === 'playing' && (
          <div className="absolute inset-0 pointer-events-none flex items-end justify-between p-12 z-40">
             {/* D-PAD Left/Right */}
             <div className="flex gap-4 pointer-events-auto">
                <button 
                  onPointerDown={() => setKeys(p => ({ ...p, KeyA: true }))}
                  onPointerUp={() => setKeys(p => ({ ...p, KeyA: false }))}
                  onPointerLeave={() => setKeys(p => ({ ...p, KeyA: false }))}
                  className="w-24 h-24 bg-zinc-900/60 backdrop-blur-md border-[3px] border-zinc-800 rounded-[28px] flex items-center justify-center active:scale-90 transition-all active:border-indigo-500 active:bg-indigo-600/20"
                >
                   <ChevronLeft className="w-12 h-12 text-zinc-400" />
                </button>
                <button 
                  onPointerDown={() => setKeys(p => ({ ...p, KeyD: true }))}
                  onPointerUp={() => setKeys(p => ({ ...p, KeyD: false }))}
                  onPointerLeave={() => setKeys(p => ({ ...p, KeyD: false }))}
                  className="w-24 h-24 bg-zinc-900/60 backdrop-blur-md border-[3px] border-zinc-800 rounded-[28px] flex items-center justify-center active:scale-90 transition-all active:border-indigo-500 active:bg-indigo-600/20"
                >
                   <ChevronRight className="w-12 h-12 text-zinc-400" />
                </button>
             </div>

             {/* Jump Button */}
             <div className="pointer-events-auto">
                <button 
                  onPointerDown={() => setKeys(p => ({ ...p, Space: true }))}
                  onPointerUp={() => setKeys(p => ({ ...p, Space: false }))}
                  onPointerLeave={() => setKeys(p => ({ ...p, Space: false }))}
                  className="w-32 h-32 bg-indigo-600/80 backdrop-blur-md border-[4px] border-indigo-400 rounded-[40px] flex flex-col items-center justify-center active:scale-95 transition-all shadow-2xl shadow-indigo-600/20 active:bg-indigo-500"
                >
                   <ArrowUp className="w-16 h-16 text-white" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mt-1">Boost</span>
                </button>
             </div>
          </div>
        )}

        {/* The Player */}
        <div 
          className="player absolute transition-[transform] duration-75 ease-linear pointer-events-none"
          style={{ 
            left: 0, 
            top: 0, 
            transform: `translate(${player.x}px, ${player.y}px)`, 
            width: player.width, 
            height: player.height 
          }}
        >
           <CharacterPreview character={character} className="w-full h-full" showShadow={false} />
        </div>

        {/* Overlays */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-12 bg-zinc-900 border border-zinc-800 rounded-[48px] shadow-2xl"
            >
              <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 block">Simulation Ended</span>
              <h3 className={`text-8xl font-black italic mb-12 uppercase tracking-tighter ${gameState === 'won' ? 'text-emerald-400' : 'text-rose-500'}`}>
                {gameState === 'won' ? 'Victory' : 'Fault'}
              </h3>
              <div className="flex gap-4 justify-center">
                 <button 
                   onClick={reset}
                   className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all flex items-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95"
                 >
                   <RefreshCw className="w-5 h-5 font-bold" />
                   Reinitialize
                 </button>
                 <button 
                   onClick={onBack}
                   className="bg-zinc-800 text-zinc-300 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-700 transition-all flex items-center gap-3 active:scale-95 border border-zinc-700"
                 >
                   <ArrowLeft className="w-5 h-5" />
                   Abort
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="mt-12 flex gap-12 text-zinc-700 font-black uppercase italic tracking-widest text-[9px]">
         <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 not-italic">WASD</div>
            <span>Navigate</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 not-italic">SPACE</div>
            <span>Boost</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 not-italic">R</div>
            <span>Reset</span>
         </div>
      </div>
    </div>
  );
}
