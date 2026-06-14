import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  RotateCcw,
  Heart,
  ExternalLink,
  Maximize2,
  Minimize2,
  Gamepad2,
  Star,
  Info,
  Play,
  Monitor
} from "lucide-react";

export default function GameTheater({
  game,
  isFavorite,
  onToggleFavorite,
  onBack,
  otherGames,
  onSelectGame
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rating, setRating] = useState(0);
  const iframeContainerRef = useRef(null);

  // Load and saved individual game rating from localStorage
  useEffect(() => {
    const savedRatings = localStorage.getItem("bedoked_game_ratings");
    if (savedRatings) {
      try {
        const parsed = JSON.parse(savedRatings);
        if (parsed[game.id]) {
          setRating(parsed[game.id]);
        } else {
          setRating(0);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setRating(0);
    }
    setIsLoading(true); // reset loading when game changes
  }, [game.id, reloadKey]);

  const handleRate = (value) => {
    setRating(value);
    const savedRatings = localStorage.getItem("bedoked_game_ratings");
    let parsed = {};
    if (savedRatings) {
      try {
        parsed = JSON.parse(savedRatings);
      } catch (e) {
        parsed = {};
      }
    }
    parsed[game.id] = value;
    localStorage.setItem("bedoked_game_ratings", JSON.stringify(parsed));
  };

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!iframeContainerRef.current) return;

    if (!document.fullscreenElement) {
      iframeContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Tam ekran başlatılamadı:", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Monitor fullscreen change events (e.g. user pressing Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div id="game-theater-container" className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Left 3/4 Column: Game Window & details */}
      <div className="lg:col-span-3 flex flex-col space-y-4">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#0a0a12] p-4 border border-indigo-900/30 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Kütüphaneye Dön
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-white">
              {game.title}
            </h2>
            <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-300">
              {game.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Reset */}
            <button
              onClick={handleReload}
              className="rounded-lg bg-[#161625] border border-indigo-900/30 p-2 text-slate-400 hover:bg-indigo-650 hover:text-white transition-colors"
              title="Oyunu Yeniden Başlat"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Favorite */}
            <button
              onClick={(e) => onToggleFavorite(game.id, e)}
              className={`rounded-lg p-2 border transition-colors ${
                isFavorite
                  ? "bg-indigo-950/50 text-indigo-400 border-indigo-500/40"
                  : "bg-[#161625] text-slate-400 border-indigo-900/30 hover:bg-indigo-650 hover:text-white"
              }`}
              title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>

            {/* External */}
            <a
              href={game.iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#161625] border border-indigo-900/30 p-2 text-slate-400 hover:bg-indigo-650 hover:text-white transition-colors"
              title="Yeni Sekmede Aç"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="rounded-lg bg-[#161625] border border-indigo-900/30 p-2 text-slate-400 hover:bg-indigo-650 hover:text-white transition-colors"
              title="Tam Ekran Yap"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Iframe Screen Frame */}
        <div
          ref={iframeContainerRef}
          className={`relative aspect-video w-full overflow-hidden rounded-2xl border-4 border-[#0a0a12] bg-[#050508] shadow-2xl transition-all ${
            isFullscreen ? "border-0 rounded-none h-full w-full" : ""
          }`}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508]/95 z-20">
              <div className="relative">
                <div className="h-14 w-14 rounded-full border-4 border-indigo-950 border-t-indigo-500 animate-spin" />
                <Gamepad2 className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-indigo-450 animate-pulse" />
              </div>
              <p className="mt-4 text-xs tracking-wider text-indigo-400 uppercase font-extrabold">
                Oyun Yükleniyor...
              </p>
            </div>
          )}

          {/* Real Game Iframe */}
          <iframe
            key={`${game.id}-${reloadKey}`}
            src={game.iframeUrl}
            title={game.title}
            className="h-full w-full border-none select-none bg-transparent"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Game instructions underneath */}
        <div className="rounded-2xl border border-indigo-900/30 bg-[#0a0a12]/60 p-5 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Rating column */}
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Star className="h-3.5 w-3.5 text-indigo-400 fill-current" />
                Oyunu Değerlendir
              </h4>
              <div className="mt-1.5 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className="p-0.5 text-zinc-650 hover:scale-110 transition-transform"
                    title={`${star} Yıldız Ver`}
                  >
                    <Star
                      className={`h-5 w-5 transition-colors ${
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-600 hover:text-slate-450"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-xs font-semibold text-indigo-400">
                    ({rating}/5 Yıldız verdiniz)
                  </span>
                )}
              </div>
            </div>

            {/* Controller tip */}
            <div className="flex-1 max-w-xl md:ml-6">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Info className="h-3.5 w-3.5 text-indigo-400" />
                Kontroller & Nasıl Oynanır?
              </h4>
              <p className="mt-1 text-sm font-medium text-slate-300 bg-[#161625]/60 rounded-lg p-2.5 border border-indigo-900/20">
                {game.controls}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-indigo-900/20 pt-4">
            <h4 className="text-sm font-semibold text-white">Yüklenmiyorsa ne yapmalı?</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Bazı tarayıcı eklentileri veya ağ kısıtlamaları oyun iframelerini engelliyor olabilir. Oyun penceresi yüklenmezse veya boş kalırsa sayfanın üstündeki 
              <span className="mx-1 inline-flex items-center gap-0.5 text-indigo-400 font-bold">
                <ExternalLink className="h-3 w-3" /> Yeni Sekmede Aç
              </span> 
              bağlantısına tıklayarak oyunu engelsiz bir kaynaktan doğrudan oynayabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Right 1/4 Column: Sidebar list of other games */}
      <div className="lg:col-span-1 rounded-2xl border border-indigo-900/30 bg-[#0a0a12]/50 p-4 backdrop-blur-md self-start shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
          <Gamepad2 className="h-4 w-4 text-indigo-400 animate-pulse" />
          Hızlı Seçenekler
        </h3>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {otherGames.map((g) => (
            <button
              key={g.id}
              onClick={() => onSelectGame(g)}
              className={`w-full group text-left flex items-center gap-3 p-2.5 rounded-xl transition-all border ${
                g.id === game.id
                  ? "bg-[#161625] border-indigo-500/30 pointer-events-none"
                  : "bg-[#161625]/50 border-indigo-950/40 hover:bg-[#1b1b30] hover:border-indigo-900/30"
              }`}
            >
              {/* Colored tag on active, otherwise sub-icon */}
              <div className={`h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-br ${g.gradient} text-white`}>
                <Gamepad2 className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                  {g.title}
                </h4>
                <p className="text-[10px] text-indigo-400/70 truncate">{g.category}</p>
              </div>

              {g.id !== game.id && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-3 w-3 text-indigo-400 fill-current" />
                </div>
              )}
            </button>
          ))}
          {otherGames.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-4">Gösterilebilecek başka oyun yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
