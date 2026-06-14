import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, CloudRain, Cloud, Sparkles, Wind, Droplets } from 'lucide-react';
import { closetApi } from '../services/api';

export default function WeatherRecommendation({ user, t }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchRecommendation();
  }, [user]);

  const fetchRecommendation = async () => {
    setLoading(true);
    try {
      const res = await closetApi.getRecommendations({});
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !data) return null;

  const { weather, recommendation } = data;

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny': case 'clear': return <CloudSun className="text-amber-500" size={32} />;
      case 'rain': case 'drizzle': return <CloudRain className="text-blue-500" size={32} />;
      default: return <Cloud className="text-slate-400" size={32} />;
    }
  };

  const isAr = t.weatherTitle && t.weatherTitle.includes('طقس');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-6 mb-16"
    >
      <div className="glass-panel dark:bg-slate-800/50 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-[80px] -z-0"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex items-center gap-6 min-w-max">
            <div className="w-20 h-20 glass-panel dark:bg-slate-700/50 rounded-3xl flex items-center justify-center">
              {getWeatherIcon(weather.condition)}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{t.weatherTitle}</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-slate-900 dark:text-white">{weather.temp}°</span>
                <span className="text-lg font-bold text-slate-400 mb-1">C</span>
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{weather.city} — {weather.condition}</p>
            </div>
          </div>

          <div className="hidden lg:block w-px h-24 bg-slate-100 dark:bg-slate-700"></div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 premium-gradient rounded-xl flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <span className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">{t.aiPick}</span>
            </div>
            
            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              {recommendation.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex items-center gap-3 glass-panel dark:bg-slate-700/30 p-3 pr-5 rounded-2xl min-w-[180px] cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <img src={`http://127.0.0.1:8000/${item.image_url}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 dark:text-white truncate max-w-[110px]">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
