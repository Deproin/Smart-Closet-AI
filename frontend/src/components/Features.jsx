import React from 'react'
import { Sparkles, Cloud, ArrowUpRight, Zap } from 'lucide-react'

export default function Features({ t }) {
  const featureItems = [
    {
      title: t.feature1,
      description: t.feature1Desc,
      icon: Sparkles,
      gradient: 'from-pink-500 to-rose-500',
      span: 'md:col-span-2'
    },
    {
      title: t.feature2,
      description: t.feature2Desc,
      icon: Cloud,
      gradient: 'from-sky-400 to-blue-600',
      span: ''
    }
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden" id="style hub">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 glass-panel rounded-full text-sm font-bold mb-6 text-slate-500">
            <Zap size={14} className="text-pink-500" />
            POWERFUL CAPABILITIES
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            {t.featuresTitle}<br/> {t.featuresTitle2}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg font-medium">
            {t.featuresSub}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {featureItems.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx} 
                className={`group glass-panel rounded-[2.5rem] p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden ${feature.span}`}
              >
                <div className={`absolute -right-16 -top-16 w-40 h-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl`}></div>
                
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
                    <Icon size={26} strokeWidth={2} />
                  </div>
                  <div className="w-10 h-10 glass-panel rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-45">
                    <ArrowUpRight size={18} className="text-slate-500" />
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.description}</p>
                <div className={`mt-6 h-1 w-0 group-hover:w-1/2 bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-500`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
