import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Loader2, Trash2, Shirt } from 'lucide-react'
import { closetApi } from '../services/api'

export default function DigitalCloset({ user, refreshTrigger, onAddItem, t }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const CATEGORIES = ['All', 'Shirt', 'Pants', 'Shoes', 'Perfume', 'Accessories'];

  useEffect(() => {
    if (user) fetchItems();
    else setItems([]);
  }, [user, refreshTrigger]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await closetApi.getItems();
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Remove?")) {
      try {
        await closetApi.deleteItem(id);
        fetchItems();
      } catch (err) {
        alert("Error");
      }
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase());
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <section className="py-24 px-6 relative" id="closet">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{t.wardrobeManager}</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.closetTitle} <span className="text-gradient">{t.closetTitleAccent}</span>
            </h2>
            <p className="text-slate-500 mt-3 font-medium">
              {user ? `${items.length} ${t.itemsSaved}` : t.loginToStart}
            </p>
          </div>
          
          {user && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 py-3 glass-panel rounded-2xl dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-pink-300 outline-none w-52 sm:w-64"
                />
              </div>
              <button onClick={onAddItem} className="btn-premium px-4 py-3"><Plus size={20} /></button>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'glass-panel text-slate-500 dark:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {!user ? (
          <div className="text-center py-24 glass-panel dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-700">
             <Shirt size={48} className="mx-auto text-slate-300 mb-6" />
             <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3">{t.closetTitle}</h3>
             <button onClick={onAddItem} className="btn-premium px-8 py-3 mt-4">{t.addItem}</button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32"><Loader2 className="animate-spin text-pink-500" size={40} /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group">
                  <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-[2rem] mb-4 overflow-hidden relative glass-panel">
                    <img src={`http://127.0.0.1:8000/${item.image_url}`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <button onClick={(e) => handleDelete(e, item.id)} className="absolute bottom-4 right-4 w-9 h-9 bg-white dark:bg-slate-900 text-rose-500 rounded-xl scale-0 group-hover:scale-100 transition-all flex items-center justify-center shadow-lg"><Trash2 size={16} /></button>
                  </div>
                  <h3 className="font-black text-slate-800 dark:text-white text-sm text-center truncate px-2">{item.name}</h3>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
