import React from "react";
import { motion } from "motion/react";
import { Heart, Play, Gamepad2, Grid, Binary, Hexagon, Bird, TrendingUp, Bomb, CircleDot, Sliders, Palette, Layers, Trash2 } from "lucide-react";

const iconMap = {
  Gamepad2,
  Grid,
  Binary,
  Hexagon,
  Bird,
  TrendingUp,
  Bomb,
  CircleDot,
  Sliders,
  Palette,
  Layers
};

export default function GameCard({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
  onDeleteCustomGame
}) {
  const IconComponent = iconMap[game.iconName] || Gamepad2;

  return (
    <motion.div
      id={`game-card-${game.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#161625] transition-all shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]"
    >
      {/* Game Visual Aspect Container */}
      <div className={`relative aspect-video w-full bg-gradient-to-br ${game.gradient} flex items-center justify-center overflow-hidden border-b border-indigo-950/20`}>
        {/* Abstract animated grid layer */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_14px]" />
        
        {/* Soft center glowing orb */}
        <div className="absolute h-24 w-24 rounded-full bg-white/15 blur-xl group-hover:scale-125 transition-transform duration-500" />
        
        <IconComponent className="relative z-10 h-12 w-12 text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover:rotate-6 transition-transform duration-300" />
        
        {/* Category Badge overlay */}
        <span className="absolute top-3 left-3 rounded-md bg-black/40 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 border border-indigo-500/10">
          {game.category}
        </span>
        
        {/* Quick hover trigger to play overlay */}
        <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
          <button 
            onClick={() => onSelectGame(game)}
            className="flex items-center gap-1.5 rounded-full bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 shadow-lg border border-indigo-400/30 hover:bg-indigo-600 active:scale-95 transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            BAŞLAT
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4.5 bg-[#0f0f1b]/60">
        <div className="mb-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              {game.title}
            </h3>
            {game.isCustom && onDeleteCustomGame && (
              <button
                onClick={(e) => onDeleteCustomGame(game.id, e)}
                className="shrink-0 rounded-full bg-red-950/20 p-1 text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors"
                title="Oyunu Sil"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {game.description}
          </p>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-indigo-950/30">
          <button
            onClick={() => onSelectGame(game)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600/10 border border-indigo-500/20 px-3.5 py-1.5 text-xs font-bold text-indigo-300 transition-colors hover:bg-indigo-500 hover:text-white"
          >
            <Play className="h-3 w-3 fill-current" />
            Oyna
          </button>

          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`rounded-lg p-2 transition-colors ${
              isFavorite
                ? "bg-indigo-950/40 text-indigo-400 border border-indigo-550/20"
                : "bg-zinc-800/20 text-slate-500 hover:bg-zinc-800/40 hover:text-slate-350"
            }`}
            title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
