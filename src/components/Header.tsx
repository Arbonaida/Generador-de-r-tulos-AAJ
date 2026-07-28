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
    <header className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20 font-clash text-base shrink-0">
          9:16
        </div>

        <div>
          <h1 className="font-bold text-slate-100 text-sm sm:text-base leading-tight flex items-center gap-2">
            <span>Generador de rótulos AAJ</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-500/20 text-teal-300 font-mono border border-teal-500/30">
              Vídeo Vertical 9:16
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden xs:block">
            Lower Third profesional para Instagram Reels, TikTok, YouTube Shorts y X
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
        <button
          onClick={onPlayAnimation}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
        >
          <Play className="w-3.5 h-3.5 text-teal-400 fill-current" />
          <span>Probar Animación</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Rótulo</span>
        </button>
      </div>
    </header>
  );
};
