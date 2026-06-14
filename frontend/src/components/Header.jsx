import React from 'react'
import { Shirt, User, LogOut, LayoutGrid, Zap, Moon, Sun, Globe, Sparkles } from 'lucide-react'

export default function Header({ user, onAuthClick, onLogout, darkMode, setDarkMode, lang, setLang }) {
  return (
    <nav className="fixed top-2 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[98%] sm:w-[95%] max-w-6xl glass-panel rounded-2xl sm:rounded-[2rem] px-3 sm:px-4 py-2 sm:py-3 transition-colors duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
          <div className="w-9 h-9 sm:w-11 sm:h-11 premium-gradient rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12">
            <Shirt size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-lg font-black tracking-tight leading-none dark:text-white text-slate-900">
              SMART<span className="text-gradient">CLOSET</span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">{lang === 'ar' ? 'ذكاء اصطناعي' : 'AI POWERED'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass-panel text-slate-500 hover:text-pink-500 transition-all dark:bg-slate-800"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl glass-panel text-xs font-bold text-slate-500 hover:text-indigo-500 transition-all dark:bg-slate-800"
          >
            <Globe size={18} />
            <span className="uppercase">{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {user ? (
            <button onClick={onLogout} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
              <LogOut size={20} />
            </button>
          ) : (
            <button onClick={onAuthClick} className="btn-premium px-4 sm:px-6 py-2 text-xs sm:text-sm whitespace-nowrap">
              {lang === 'ar' ? 'دخول' : 'Sign In'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
