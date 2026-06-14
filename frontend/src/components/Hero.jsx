import React from 'react'
import { ArrowRight, Sparkles, Wand2, CloudSun } from 'lucide-react'

export default function Hero({ onStartClick, t }) {
  return (
    <section className="relative pt-44 pb-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="staggered-load text-center lg:text-left rtl:lg:text-right">
          <div className="inline-flex items-center gap-2 px-5 py-2 glass-panel rounded-full text-sm font-bold mb-8">
            <span className="text-slate-500 mx-1">{t.trustedBy}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight mb-8 tracking-tighter">
            {t.heroTitle1}<br /> 
            <span className="text-gradient">{t.heroTitle2}</span>
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
            {t.heroSub}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <button onClick={onStartClick} className="btn-premium flex items-center justify-center gap-3 group px-8 py-4">
              <span>{t.buildCloset}</span>
              <ArrowRight size={20} className="rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        <div className="relative hidden lg:block">
          <div className="glass-panel p-6 rounded-[3rem] rotate-3 animate-float overflow-hidden">
             <div className="relative aspect-[10/12] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" 
                  alt="Fashion"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute bottom-8 left-8 right-8 p-6 glass-panel rounded-3xl">
                   <div className="flex items-center justify-between mb-2">
                     <p className="text-sm font-bold text-slate-900 dark:text-white">{t.ootdChoice}</p>
                     <CloudSun className="text-amber-500" size={20} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
