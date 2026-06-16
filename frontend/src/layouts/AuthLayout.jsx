import React from 'react';
import { Outlet } from 'react-router-dom';
import useTheme from '../hooks/useTheme';
import { Sun, Moon, Sparkles } from 'lucide-react';

const AuthLayout = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center bg-black dark:bg-[#030303] light:bg-[#fcfcfc] dark-grid-bg transition-colors duration-200">
      {/* Background radial accent glow */}
      <div className="accent-glow top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"></div>

      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-6 right-8 z-10">
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1a1a1a] light:border-zinc-200 bg-black/60 light:bg-white/60 text-zinc-400 light:text-zinc-600 hover:text-white light:hover:text-black backdrop-blur-md transition-all cursor-pointer"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Auth Content Card Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center space-x-2.5 bg-zinc-900/40 light:bg-zinc-100 border border-zinc-800/80 light:border-zinc-200/80 px-4 py-2 rounded-2xl backdrop-blur-sm shadow-xl shadow-black/20">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
              IQ
            </div>
            <span className="text-xl font-bold tracking-tight text-white light:text-black">
              Hire<span className="text-brand-500">IQ</span>
            </span>
          </div>
        </div>
        
        <div className="border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a]/80 light:bg-white/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl shadow-black/40 light:shadow-zinc-200/50">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-xs text-zinc-600 light:text-zinc-400 z-10">
        &copy; {new Date().getFullYear()} HireIQ Platform. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout;
