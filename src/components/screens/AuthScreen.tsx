import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Key, ArrowRight, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import { storage } from '../../storage';
import { User as UserType } from '../../types';

interface AuthScreenProps {
  onLogin: (user: UserType) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3 || password.length < 4) {
      setError('Credentials too short (Min: 3 user, 4 pass)');
      return;
    }

    const users = storage.getUsers();

    if (isLogin) {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        storage.setSession(user);
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    } else {
      if (users.some(u => u.username === username)) {
        setError('Username already exists');
        return;
      }
      const newUser: UserType = {
        id: Math.random().toString(36).substring(7),
        username,
        password,
      };
      storage.saveUser(newUser);
      storage.setSession(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="h-full bg-zinc-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[48px] p-12 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            {isLogin ? 'Welcome Back' : 'Join the world'}
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-3">
            Toryloria Identity Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Username</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input 
                type="text"
                placeholder="Ex_Player123"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-16 pr-6 py-4 font-black uppercase tracking-tight text-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Password</label>
            <div className="relative">
              <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-16 pr-6 py-4 font-black tracking-tight text-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-3 rounded-xl text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-[20px] font-black uppercase tracking-widest text-sm text-white flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isLogin ? 'Access System' : 'Create Profile'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            {isLogin ? "No identity recorded?" : "Already in the database?"}
          </p>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="mt-4 text-indigo-400 font-black uppercase text-xs tracking-[0.2em] hover:text-indigo-300 transition-colors"
          >
            {isLogin ? 'Switch to Registration' : 'Return to Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
