/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import defaultGamesData from "./games.json";
import GameCard from "./components/GameCard";
import GameTheater from "./components/GameTheater";
import CustomGameModal from "./components/CustomGameModal";
import {
  Gamepad2,
  Search,
  Heart,
  LayoutGrid,
  Plus,
  Flame,
  Zap,
  Info,
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [customGames, setCustomGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Hepsi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  // Load from local storage
  useEffect(() => {
    // Favorites
    const savedFavs = localStorage.getItem("bedoked_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }

    // Custom games
    const savedCustom = localStorage.getItem("bedoked_custom_games");
    if (savedCustom) {
      try {
        setCustomGames(JSON.parse(savedCustom));
      } catch (e) {
        console.error(e);
      }
    }

    // Play count
    const savedPlayCount = localStorage.getItem("bedoked_play_count");
    if (savedPlayCount) {
      setPlayCount(parseInt(savedPlayCount, 10));
    }

    // Merge default and custom
    const defaultGames = defaultGamesData;
    setGames(defaultGames);
  }, []);

  // Sync favorites with localStorage
  const handleToggleFavorite = (id, e) => {
    e.stopPropagation(); // Stop clicking card trigger
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("bedoked_favorites", JSON.stringify(updated));
  };

  // Add custom unblocked game
  const handleAddCustomGame = (newGame) => {
    const updatedCustom = [...customGames, newGame];
    setCustomGames(updatedCustom);
    localStorage.setItem("bedoked_custom_games", JSON.stringify(updatedCustom));
  };

  // Delete custom game
  const handleDeleteCustomGame = (id, e) => {
    e.stopPropagation();
    const updatedCustom = customGames.filter((g) => g.id !== id);
    setCustomGames(updatedCustom);
    localStorage.setItem("bedoked_custom_games", JSON.stringify(updatedCustom));

    // Also remove from favorites if in there
    if (favorites.includes(id)) {
      const updatedFavs = favorites.filter((favId) => favId !== id);
      setFavorites(updatedFavs);
      localStorage.setItem("bedoked_favorites", JSON.stringify(updatedFavs));
    }

    // If currently playing that deleted custom game, exit theater
    if (selectedGame && selectedGame.id === id) {
      setSelectedGame(null);
    }
  };

  // Combine default with custom games
  const allAvailableGames = useMemo(() => {
    return [...games, ...customGames];
  }, [games, customGames]);

  // Handle select game to play (increment play count)
  const handleSelectGame = (game) => {
    setSelectedGame(game);
    const updatedCount = playCount + 1;
    setPlayCount(updatedCount);
    localStorage.setItem("bedoked_play_count", updatedCount.toString());

    // Scroll back to top for optimal gameplay viewing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter games list based on search and selected category
  const filteredGames = useMemo(() => {
    return allAvailableGames.filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "Hepsi" ||
        (activeCategory === "Favoriler" && favorites.includes(game.id)) ||
        game.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allAvailableGames, searchQuery, activeCategory, favorites]);

  // Popular games list to show in marquee / quick links (e.g. standard classical favorites)
  const popularGames = useMemo(() => {
    return allAvailableGames.slice(0, 4);
  }, [allAvailableGames]);

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Mesh Effect */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[70%] rounded-full bg-indigo-950/20 blur-[130px]" />
        <div className="absolute -right-[15%] bottom-0 h-[60%] w-[60%] rounded-full bg-indigo-900/15 blur-[150px]" />
        <div className="absolute top-[30%] left-[25%] h-[40%] w-[40%] rounded-full bg-purple-950/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation / Header */}
        <header className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-indigo-900/30 bg-[#0a0a12] p-5 rounded-2xl md:flex-row shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-[0_0_18px_rgba(99,102,241,0.45)] border border-indigo-400/20">
              <Gamepad2 className="h-5.5 w-5.5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-2.5xl font-black tracking-tighter text-white">
                BEDOKED
              </h1>
              <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Engelsiz Eğlence Portalı</p>
            </div>
          </div>

          {/* Core user counts & actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-6 rounded-xl bg-[#161625]/90 px-4 py-2 border border-indigo-900/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
              <div className="text-center">
                <span className="block text-lg font-black text-white">{allAvailableGames.length}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Oyun</span>
              </div>
              <div className="h-6 w-px bg-indigo-950/60" />
              <div className="text-center">
                <span className="block text-lg font-black text-indigo-400">{favorites.length}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Favori</span>
              </div>
              <div className="h-6 w-px bg-indigo-950/60" />
              <div className="text-center">
                <span className="block text-lg font-black text-emerald-400">{playCount}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Oynama</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-400/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Özel Iframe Ekle
            </button>
          </div>
        </header>

        {/* Dynamic Display Layout */}
        <main>
          {selectedGame ? (
            /* Active Iframe Player Theatre View */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <GameTheater
                game={selectedGame}
                isFavorite={favorites.includes(selectedGame.id)}
                onToggleFavorite={handleToggleFavorite}
                onBack={() => setSelectedGame(null)}
                // Provide other games excluding active one
                otherGames={allAvailableGames.filter((g) => g.id !== selectedGame.id)}
                onSelectGame={handleSelectGame}
              />
            </motion.div>
          ) : (
            /* Main Game Library Dashboard */
            <div className="space-y-8">
              {/* Marketing Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-[#0a0a12]/75 border border-indigo-900/30 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
                <div className="absolute left-1/3 bottom-0 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />

                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/20">
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                    Bedoked Unblocked Hub
                  </div>
                  <h2 className="mt-4 text-2xl font-black text-white sm:text-3.5xl tracking-tighter leading-none">
                    Engelleri Kaldırın, <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Oyunun Keyfini</span> Çıkarın!
                  </h2>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xl">
                    Okullarda, kütüphanelerde veya iş yerlerinde ağ kısıtlamalarına takılmadan tamamen ücretsiz, güvenli ve reklamsız retro HTML5 oyun portalı. İstediğiniz iframe oyununu da anında özel listeye ekleyebilirsiniz.
                  </p>

                  {/* Quick-play suggestions marquee */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Popüler:</span>
                    {popularGames.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleSelectGame(g)}
                        className="flex items-center gap-1 rounded-full bg-[#161625] hover:bg-[#1a1a2e] border border-indigo-900/30 px-3.5 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                      >
                        <Play className="h-2.5 w-2.5 text-indigo-400 fill-current" />
                        {g.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Controls / Filter Navigation Row */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#0a0a12]/40 p-4 rounded-xl border border-indigo-900/20">
                {/* Categorization Tabs */}
                <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {["Hepsi", "Bulmaca", "Klasik", "Beceri", "Refleks", "Favoriler"].map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`relative rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                            : "bg-[#161625] text-slate-400 hover:bg-[#1c1c30] hover:text-white border border-indigo-900/10"
                        }`}
                      >
                        {cat === "Favoriler" && (
                          <Heart className={`mr-1 inline h-3.5 w-3.5 ${isActive ? "fill-current" : ""}`} />
                        )}
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Search input */}
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-indigo-400/60" />
                  <input
                    type="text"
                    placeholder="Oyun ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-indigo-900/30 bg-[#161625] px-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                      Sıfırla
                    </button>
                  )}
                </div>
              </div>

              {/* Game Cards Grid View */}
              <motion.div
                id="games-grid"
                layout
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                <AnimatePresence>
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectGame={handleSelectGame}
                      onDeleteCustomGame={handleDeleteCustomGame}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Empty state matches */}
              {filteredGames.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-indigo-950 bg-[#0a0a12]/40 py-16 text-center shadow-lg">
                  <Gamepad2 className="h-12 w-12 text-indigo-500/80 animate-pulse" />
                  <p className="mt-4 text-sm font-semibold text-slate-300">
                    Aramanızla eşleşen hiçbir unblocked oyun bulunamadı.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Farklı bir kategori seçmeyi deneyebilir veya kendi özel oyun linkinizi ekleyebilirsiniz.
                  </p>
                  <div className="mt-6 flex gap-3">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="rounded-xl bg-[#161625] border border-indigo-900/30 px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1f1f33] transition-colors"
                      >
                        Aramayı Temizle
                      </button>
                    )}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.35)] border border-indigo-400/20 transition-all cursor-pointer"
                    >
                      Özel Oyun Ekle
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-20 border-t border-indigo-900/20 pt-6 pb-12 flex flex-col items-center justify-between gap-4 md:flex-row text-[10px] tracking-widest uppercase text-indigo-300/40">
          <p>
            BEDOKED &copy; 2026 &bull; UNBLOCKED ENTERTAINMENT - Tüm hakları saklıdır. HTML5 oyunlar ilgili geliştiricilerine aittir.
          </p>
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Info className="h-3.5 w-3.5 opacity-60" />
            <span>Okul, Kolej ve iş yerleri için tamamen engelsiz tasarlanmıştır.</span>
          </div>
        </footer>
      </div>

      {/* Add Custom Game Dialog Modal */}
      <CustomGameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddGame={handleAddCustomGame}
      />
    </div>
  );
}
