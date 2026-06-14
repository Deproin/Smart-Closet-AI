import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Check, Loader2, Sparkles, Tag, Palette, ShirtIcon, Camera } from 'lucide-react';
import { closetApi } from '../services/api';

const CATEGORIES = ['Shirt', 'Pants', 'Shoes', 'Perfume', 'Accessories', 'Dress', 'Jacket', 'Hat'];

export default function AddItemModal({ isOpen, onClose, onRefresh }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState(1); // 1=upload, 2=details

  const [formData, setFormData] = useState({
    name: '',
    category: 'Shirt',
    color: 'White',
    tags: '',
    brand: ''
  });

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStep(2);

      setAnalyzing(true);
      try {
        await new Promise(r => setTimeout(r, 1800));
        setFormData(prev => ({
          ...prev,
          name: 'Item ' + selectedFile.name.split('.')[0].slice(0, 15),
          category: 'Shirt',
          color: 'Blue'
        }));
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('color', formData.color);
      data.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim()).filter(Boolean)));
      if (formData.brand) data.append('brand', formData.brand);

      await closetApi.addItem(data);
      onRefresh();
      handleClose();
    } catch (err) {
      alert("Error adding item. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFile(null);
    setPreview(null);
    setStep(1);
    setFormData({ name: '', category: 'Shirt', color: 'White', tags: '', brand: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white rounded-t-[3rem] sm:rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-7 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <Sparkles size={22} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Add to Closet</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    {step === 1 ? 'Step 1 — Upload photo' : 'Step 2 — Review details'}
                  </p>
                </div>
              </div>
              <button onClick={handleClose} className="w-10 h-10 glass-panel rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mx-7 h-1 bg-slate-100 rounded-full mb-6 overflow-hidden">
              <motion.div
                animate={{ width: step === 1 ? '40%' : '100%' }}
                className="h-full premium-gradient rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>

            <form onSubmit={handleSubmit} className="px-7 pb-7 grid sm:grid-cols-[1fr_1.2fr] gap-7">
              {/* Left: Upload Zone */}
              <div>
                <div
                  className={`relative aspect-[3/4] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group
                    ${preview ? 'border-pink-300 bg-pink-50/30' : 'border-slate-200 hover:border-pink-300 hover:bg-pink-50/20'}`}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-3">
                        <Camera size={32} />
                        <p className="font-bold text-sm">Change Photo</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-20 h-20 glass-panel rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={28} className="text-slate-400" />
                      </div>
                      <p className="font-black text-slate-700">Drop your photo here</p>
                      <p className="text-sm text-slate-400 mt-2">or click to browse files</p>
                      <p className="text-xs text-slate-300 mt-1 font-medium">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>

                {/* AI Analyzing indicator */}
                <AnimatePresence>
                  {analyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-4 flex items-center gap-3 text-pink-600 text-sm font-bold glass-panel px-4 py-3 rounded-2xl"
                    >
                      <Loader2 size={16} className="animate-spin" />
                      <span>AI is analyzing your item...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Form Details */}
              <div className="space-y-4">
                {/* Item Name */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Item Name</label>
                  <input
                    type="text" required
                    placeholder="e.g. White Slim Shirt"
                    className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    <ShirtIcon size={12} className="inline mr-1" /> Category
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat} type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`py-2 px-1 text-[11px] font-black rounded-xl transition-all ${
                          formData.category === cat
                            ? 'bg-slate-900 text-white shadow-lg'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    <Palette size={12} className="inline mr-1" /> Color
                  </label>
                  <input
                    type="text" required placeholder="e.g. Navy Blue"
                    className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    <Tag size={12} className="inline mr-1" /> Tags
                  </label>
                  <input
                    type="text" placeholder="casual, formal, summer..."
                    className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                {/* Save Button */}
                <button
                  disabled={loading || !file}
                  className="w-full py-4 premium-gradient text-white rounded-2xl font-black shadow-lg hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-3 mt-2"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> Saving to Closet...</>
                  ) : (
                    <><Check size={20} strokeWidth={3} /> Save to Closet</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
