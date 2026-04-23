import React from 'react';
import { Play, Hammer, User, ShoppingBag, Terminal, Zap, ExternalLink, Box, LogOut } from 'lucide-react';
import { ViewState } from '../../types';
import { motion } from 'motion/react';

interface MainMenuProps {
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

export default function MainMenu({ onNavigate, onLogout }: MainMenuProps) {
  return (
    <div className="h-full bg-zinc-950 text-zinc-100 font-sans p-8 overflow-hidden flex flex-col gap-6">
      {/* Header */}
      <header className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-2xl italic shadow-[0_0_20px_rgba(79,70,229,0.4)]">T</div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Toryloria</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl hover:bg-zinc-800 transition-colors group"
          >
            <LogOut className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">Disconnect</span>
          </button>
          
          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2 pr-6 rounded-full">
          <div className="w-10 h-10 bg-gradient-to-tr from-zinc-700 to-zinc-500 rounded-full border border-zinc-600 flex items-center justify-center text-zinc-300">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide leading-none">DEVELOPER_MODE</p>
            <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-wider">Local Storage Active</p>
          </div>
        </div>
      </div>
    </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 grid-rows-6 gap-6 flex-grow flex-shrink">
        {/* Play Banner */}
        <div 
          onClick={() => onNavigate('browser')}
          className="col-span-8 row-span-4 bg-zinc-900 rounded-[32px] border border-zinc-800 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-transparent group-hover:opacity-60 transition-opacity"></div>
          <div className="relative z-10 p-12 h-full flex flex-col justify-between">
            <div className="max-w-md">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">Jump Into The World</span>
              <h2 className="text-7xl font-black mt-4 leading-[0.9] tracking-tighter uppercase italic">Ready<br/>to Play?</h2>
              <p className="text-zinc-400 mt-6 text-lg max-w-sm">Explore thousands of 2D worlds created by the community. Parkour, Puzzle, or Sandbox—the choice is yours.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-12 py-5 bg-indigo-600 text-white text-2xl font-black rounded-2xl group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20 uppercase tracking-tight flex items-center gap-3">
                <Play className="w-8 h-8 fill-current" />
                Play Now
              </button>
              <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold uppercase tracking-widest px-6">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Join 4.2k Active
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-80 h-80 opacity-20 grayscale pointer-events-none group-hover:opacity-30 transition-opacity">
            <div className="grid grid-cols-8 grid-rows-8 gap-1 rotate-12">
               {Array.from({ length: 64 }).map((_, i) => (
                 <div key={i} className={`w-8 h-8 ${i % 7 === 0 ? 'bg-indigo-500' : 'bg-zinc-800'} rounded-sm`} />
               ))}
            </div>
          </div>
        </div>

        {/* Character Card */}
        <div 
          onClick={() => onNavigate('avatar')}
          className="col-span-4 row-span-3 bg-zinc-900 rounded-[32px] border border-zinc-800 p-8 flex flex-col items-center justify-between overflow-hidden group cursor-pointer"
        >
          <div className="w-full flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">My Identity</h3>
            <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded-full font-bold">LV. 12</span>
          </div>
          
          <div className="relative group-hover:scale-110 transition-transform duration-500">
             <div className="w-40 h-40 bg-zinc-800/50 rounded-full blur-3xl absolute inset-0 -z-10 bg-indigo-500/20" />
             <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-amber-200 rounded-lg border-b-[6px] border-amber-300"></div>
                <div className="w-24 h-28 bg-indigo-500 mt-2 rounded-xl relative border-b-[6px] border-indigo-700 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-2 bg-white/10 rounded-lg"></div>
                   <div className="w-full h-1/3 bg-black/10 mt-auto"></div>
                </div>
             </div>
          </div>

          <button className="w-full py-4 bg-zinc-800 border border-zinc-700 text-xs font-black tracking-[0.2em] uppercase rounded-2xl group-hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
            <User className="w-4 h-4" />
            Customize Avatar
          </button>
        </div>

        {/* Creator Card */}
        <div 
          onClick={() => onNavigate('browser')}
          className="col-span-4 row-span-3 bg-indigo-600 rounded-[32px] p-8 relative overflow-hidden group cursor-pointer border border-indigo-500/50 shadow-xl shadow-indigo-600/10 hover:bg-indigo-500 transition-colors"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
             <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight leading-none italic">World<br/>Studio</h3>
                  <p className="text-indigo-100 text-sm mt-3 opacity-80 font-medium">Design your own 2D world</p>
               </div>
               <Hammer className="w-8 h-8 text-white/40" />
             </div>
             <div className="flex flex-col gap-3">
               <div className="flex gap-2 items-center text-[10px] font-bold text-white/60 bg-white/10 w-fit px-3 py-1 rounded-full uppercase tracking-widest">
                 <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80]"></div>
                 3 Project Drafts
               </div>
               <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform">
                 <Zap className="w-4 h-4 fill-current" />
                 Open Editor
               </button>
             </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-black/10 rounded-full blur-2xl group-hover:bg-black/20 transition-colors"></div>
        </div>

        {/* Shop Card */}
        <div 
          onClick={() => onNavigate('avatar')}
          className="col-span-4 row-span-2 bg-zinc-900 rounded-[32px] border border-zinc-800 p-8 flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-black uppercase tracking-widest text-zinc-500 text-xs">Clothing Shop</h3>
            <div className="bg-amber-500 text-black px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase italic">New Drops</div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 aspect-square bg-zinc-800 rounded-xl border border-zinc-700 p-2 flex flex-col items-center justify-center group-hover:bg-zinc-750 transition-colors">
              <ShoppingBag className="w-5 h-5 text-zinc-500 mb-1" />
              <span className="text-[8px] font-black uppercase text-zinc-500 tracking-tighter">Shop Item</span>
            </div>
            <div className="flex-1 aspect-square bg-indigo-500/20 rounded-xl border border-indigo-500/30 p-2 flex flex-col items-center justify-center">
              <div className="w-6 h-6 bg-red-500 rounded-sm mb-1 shadow-lg shadow-red-500/20"></div>
              <span className="text-[8px] font-black uppercase text-indigo-400 tracking-tighter">Iconic</span>
            </div>
            <div className="flex-1 aspect-square bg-zinc-800 rounded-xl border border-zinc-700 p-2 flex flex-col items-center justify-center group-hover:bg-zinc-750 transition-colors">
              <Box className="w-5 h-5 text-zinc-500 mb-1" />
              <span className="text-[8px] font-black uppercase text-zinc-500 tracking-tighter">Mystery</span>
            </div>
          </div>
        </div>

        {/* Recent Build Card */}
        <div 
          onClick={() => onNavigate('browser')}
          className="col-span-4 row-span-2 bg-zinc-950 rounded-[32px] border border-zinc-800 p-8 flex items-center gap-8 group cursor-pointer hover:bg-zinc-900 transition-colors"
        >
          <div className="flex-grow">
            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Recent Activity</h4>
            <div className="text-2xl font-black mt-2 text-indigo-400 uppercase tracking-tighter italic">Lava_Run_X</div>
            <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1 tracking-wider">Modified 2h ago</p>
          </div>
          <div className="shrink-0 w-16 h-16 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors shadow-inner">
            <ExternalLink className="w-6 h-6 text-zinc-700 group-hover:text-indigo-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-between items-center shrink-0 pt-4 border-t border-zinc-900 mt-2">
        <div className="text-[9px] uppercase tracking-[0.4em] text-zinc-600 font-black flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></div>
          Toryloria Engine v0.9 // HTML5 Canvas // JS Modules // Persistent JSON Storage
        </div>
        <div className="flex gap-8 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500">
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">News</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">Plugins</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">Docs</span>
          <span className="text-zinc-800">© 2026</span>
        </div>
      </footer>
    </div>
  );
}
