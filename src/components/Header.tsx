import React from 'react';
import { Download, Sparkles, Video, Play, RotateCcw, Info } from 'lucide-react';

interface Props {
  onOpenExport: () => void;
  onPlayAnimation: () => void;
  onResetDefaults: () => void;
}

export const Header: React.FC<Props> = ({
  onOpenExport,
  onPlayAnimation,
  onResetDefaults,
}) => {
  return (
    <header className="px-4 sm:px-6 py-3 border-b border-white/20 bg-[#1c9860]/95 backdrop-blur-xl sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-black/10 text-white">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/25 flex items-center justify-center p-1.5 shadow-md shrink-0 overflow-hidden group transition hover:border-white/50">
          <img src="/favicon.svg" alt="AAJ Favicon Logo" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
        </div>

        <div>
          <h1 className="font-bold text-white text-sm sm:text-base leading-tight flex items-center gap-2">
            <span>Generador de rótulos AAJ</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono border border-white/30 font-semibold">
              Vídeo 9:16
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-white/80 font-medium hidden sm:block">
            Lower Third profesional animado en Clash Display para Reels, TikTok y Shorts
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
        <button
          onClick={onPlayAnimation}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 text-xs font-semibold transition shadow-sm active:scale-95"
        >
          <Play className="w-3.5 h-3.5 text-white fill-white/20" />
          <span>Probar Animación</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-white/90 text-[#188e5a] font-bold text-xs shadow-lg shadow-black/10 active:scale-95 transition"
        >
          <Download className="w-4 h-4 text-[#188e5a]" />
          <span>Exportar Rótulo</span>
        </button>
      </div>
    </header>
  );
};
