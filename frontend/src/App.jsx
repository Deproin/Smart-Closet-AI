import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import DigitalCloset from './components/DigitalCloset'
import AuthModal from './components/AuthModal'
import AddItemModal from './components/AddItemModal'
import WeatherRecommendation from './components/WeatherRecommendation'
import { closetApi } from './services/api'
import { translations } from './translations'

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  const t = translations[lang] || translations['en'];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', lang);
  }, [darkMode, lang]);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await closetApi.getMe();
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
    };
    checkUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 transition-colors duration-500 overflow-x-hidden">
      <Header 
        user={user} 
        onAuthClick={() => setIsAuthOpen(true)} 
        onLogout={logout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        lang={lang}
        setLang={setLang}
      />
      
      <main>
        <Hero 
          onStartClick={() => {
            if (user) setIsAddItemOpen(true);
            else setIsAuthOpen(true);
          }} 
          t={t}
        />
        <WeatherRecommendation user={user} t={t} />
        <Features t={t} />
        <DigitalCloset 
          user={user}
          refreshTrigger={refreshTrigger}
          onAddItem={() => {
             if (user) setIsAddItemOpen(true);
             else setIsAuthOpen(true);
          }}
          t={t}
        />
      </main>

      <footer className="py-16 text-center border-t border-slate-100 dark:border-slate-800">
        <div className="text-2xl font-black tracking-tight mb-2 dark:text-white">
          SMART<span className="text-gradient">CLOSET</span>
        </div>
        <p className="text-slate-400 text-sm font-medium">&copy; 2026 Smart Closet AI. All rights reserved.</p>
      </footer>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={(username) => { setUser({username}); setIsAuthOpen(false); }}
      />

      <AddItemModal 
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onRefresh={() => setRefreshTrigger(prev => prev + 1)}
      />
    </div>
  )
}

export default App
