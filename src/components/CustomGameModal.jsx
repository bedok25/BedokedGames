import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Sparkles, HelpCircle, AlertCircle } from "lucide-react";

export default function CustomGameModal({
  isOpen,
  onClose,
  onAddGame
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Klasik");
  const [description, setDescription] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [controls, setControls] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Oyun ismi boş bırakılamaz!");
      return;
    }
    if (!iframeUrl.trim()) {
      setError("Iframe URL adresi boş bırakılamaz!");
      return;
    }

    try {
      new URL(iframeUrl);
    } catch (_) {
      setError("Lütfen geçerli bir internet URL adresi girin (örn: https://...)!");
      return;
    }

    // Assign randomized styles for custom game card
    const gradients = [
      "from-violet-500 to-indigo-600",
      "from-emerald-400 to-teal-600",
      "from-amber-400 to-orange-500",
      "from-rose-500 to-pink-600",
      "from-cyan-500 to-blue-600",
      "from-fuchsia-500 to-pink-600"
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const icons = ["Gamepad2", "Grid", "Sliders", "Layers", "Palette"];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim() || `${title} unblocked iframe oyunu. Bedoked ile kesintisiz oyun keyfi!`,
      iframeUrl: iframeUrl.trim(),
      iconName: randomIcon,
      gradient: randomGradient,
      controls: controls.trim() || "Varsayılan Klavye ve Fare kontrolleri geçerlidir.",
      isCustom: true
    };

    onAddGame(newGame);

    // Reset Form fields
    setTitle("");
    setCategory("Klasik");
    setDescription("");
    setIframeUrl("");
    setControls("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050508]/90 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-indigo-900/30 bg-[#0a0a12] shadow-[0_24px_50px_rgba(0,0,0,0.9)] z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-indigo-900/20 pb-4 p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Özel İframe Oyun Ekle</h3>
                  <p className="text-xs text-slate-400">Kendi unblocked iframe linkinizi Bedoked'e entegre edin!</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-[#161625] hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Form content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 rounded-lg bg-red-950/25 p-3 text-xs leading-relaxed text-red-400 border border-red-900/35">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                  Oyun İsmi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Retro Araba Yarışı"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-indigo-900/30 bg-[#161625]/60 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-indigo-900/30 bg-[#161625]/60 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    <option value="Klasik" className="bg-[#0a0a12]">Klasik</option>
                    <option value="Bulmaca" className="bg-[#0a0a12]">Bulmaca</option>
                    <option value="Beceri" className="bg-[#0a0a12]">Beceri</option>
                    <option value="Refleks" className="bg-[#0a0a12]">Refleks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                    Iframe Link (URL) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={iframeUrl}
                    onChange={(e) => setIframeUrl(e.target.value)}
                    className="w-full rounded-lg border border-indigo-900/30 bg-[#161625]/60 px-3.5 py-2 text-sm text-white placeholder-slate-650 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                  Kısa Açıklama
                </label>
                <textarea
                  rows={2}
                  placeholder="Oyun hakkında kısa bir bilgi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-indigo-900/30 bg-[#161625]/60 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                  Kontroller & Tuş Bilgisi
                </label>
                <input
                  type="text"
                  placeholder="Örn: Yön Tuşları ile sür, Boşluk ile fren yap"
                  value={controls}
                  onChange={(e) => setControls(e.target.value)}
                  className="w-full rounded-lg border border-indigo-900/30 bg-[#161625]/60 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-indigo-900/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-400/20 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Oyunu Kaydet
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
