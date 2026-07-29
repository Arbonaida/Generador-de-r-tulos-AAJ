import React, { useRef, useEffect, useState } from 'react';
import { LowerThirdConfig, SampleBackground } from '../types';
import { LowerThirdGraphic } from './LowerThirdGraphic';
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Upload,
  Image as ImageIcon,
  Film,
  Maximize2,
  Minimize2,
  Clock,
  Video,
  Layers,
} from 'lucide-react';

interface Props {
  config: LowerThirdConfig;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBg: SampleBackground;
  customBgUrl: string | null;
  customBgType: 'image' | 'video' | null;
  onUploadCustomBg: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearCustomBg: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  isLooping: boolean;
  setIsLooping: (loop: boolean) => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export const PreviewCanvas: React.FC<Props> = ({
  config,
  currentTime,
  setCurrentTime,
  isPlaying,
  setIsPlaying,
  selectedBg,
  customBgUrl,
  customBgType,
  onUploadCustomBg,
  onClearCustomBg,
  playbackSpeed,
  setPlaybackSpeed,
  isLooping,
  setIsLooping,
  previewRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoBgRef = useRef<HTMLVideoElement>(null);
  const [scale, setScale] = useState<number>(0.35); // Scale relative to 1080x1920 base
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Auto calculate scale to maintain crisp 1080x1920 aspect ratio inside container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      // Logical base canvas size for 9:16 vertical video: 1080 x 1920
      const baseWidth = 1080;
      const baseHeight = 1920;

      // Available space considering controls
      const maxAvailableHeight = Math.max(400, clientHeight - 90);
      const scaleByHeight = maxAvailableHeight / baseHeight;
      const scaleByWidth = (clientWidth - 32) / baseWidth;

      const computedScale = Math.min(scaleByHeight, scaleByWidth, 0.45);
      setScale(Math.max(0.18, computedScale));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Sync background video if custom video background is loaded
  useEffect(() => {
    if (videoBgRef.current && customBgType === 'video') {
      if (isPlaying) {
        videoBgRef.current.play().catch(() => {});
      } else {
        videoBgRef.current.pause();
      }
    }
  }, [isPlaying, customBgType]);

  useEffect(() => {
    if (videoBgRef.current && customBgType === 'video') {
      videoBgRef.current.currentTime = currentTime % (videoBgRef.current.duration || 7);
    }
  }, [currentTime, customBgType]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
  };

  const togglePlay = () => {
    if (currentTime >= config.totalDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Base canvas dimensions
  const baseW = 1080;
  const baseH = 1920;
  const scaledW = baseW * scale;
  const scaledH = baseH * scale;

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl relative text-slate-900">
      {/* Header bar */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-900">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#24C87F] text-white font-bold font-mono shadow-sm">
            9:16
          </div>
          <div>
            <span className="font-bold text-slate-900">Vista Previa Vídeo Vertical</span>
            <span className="text-slate-600 ml-2">1080 × 1920 px (60 FPS)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Custom background uploader */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24C87F] text-white hover:bg-[#1fb874] font-bold border border-[#24C87F] transition cursor-pointer text-xs shadow-md">
            <Upload className="w-3.5 h-3.5 text-white" />
            <span>Subir Fondo (Vídeo/Foto)</span>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={onUploadCustomBg}
            />
          </label>

          {customBgUrl && (
            <button
              onClick={onClearCustomBg}
              className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold border border-red-500 text-xs transition shadow-sm"
            >
              Quitar Fondo
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center p-4 bg-slate-100 overflow-hidden select-none"
        style={{
          backgroundImage:
            selectedBg.type === 'transparent' && !customBgUrl
              ? 'radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px)'
              : undefined,
          backgroundSize: '20px 20px',
        }}
      >
        {/* 9:16 Scaled Frame Box */}
        <div
          ref={previewRef}
          className="relative bg-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-300 transition-transform duration-75"
          style={{
            width: `${scaledW}px`,
            height: `${scaledH}px`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* Background Layer */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
            {customBgUrl ? (
              customBgType === 'video' ? (
                <video
                  ref={videoBgRef}
                  src={customBgUrl}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={customBgUrl}
                  alt="Custom Background"
                  className="w-full h-full object-cover"
                />
              )
            ) : selectedBg.type === 'transparent' ? (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
                }}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: selectedBg.url }}
              >
                {/* Visual guidelines / mock interviewer silhouette for context */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-25">
                  <Video className="w-16 h-16 text-slate-400 mb-2 stroke-[1.25]" />
                  <span className="text-xs text-slate-300 font-mono uppercase tracking-widest">
                    [ Zona Vídeo Vertical ]
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Lower Third Graphic Layer */}
          <LowerThirdGraphic
            config={config}
            currentTime={currentTime}
            scale={scale}
          />

          {/* Timecode overlay badge inside video frame */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-white border border-white/30 flex items-center gap-1 z-30 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24C87F] animate-pulse" />
            <span>{currentTime.toFixed(2)}s</span>
          </div>
        </div>
      </div>

      {/* Timeline Controls & Keyframe Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-3 text-slate-900">
        {/* Timeline Slider with keyframe markers */}
        <div className="relative flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-700 mb-0.5">
            <span className="text-[#188e5a] font-bold">
              Entrada: 0.0s - 1.5s
            </span>
            <span className="text-[#188e5a] font-bold">
              Pausa: 1.5s - 6.0s
            </span>
            <span className="text-[#188e5a] font-bold">
              Salida: 6.0s - 7.0s
            </span>
          </div>

          <div className="relative w-full flex items-center">
            {/* Range Track */}
            <input
              type="range"
              min="0"
              max={config.totalDuration}
              step="0.01"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#24C87F] z-10"
            />

            {/* Keyframe Visual Notches */}
            <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none flex items-center">
              {/* 1.5s marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#24C87F] z-20"
                style={{
                  left: `${(1.5 / config.totalDuration) * 100}%`,
                }}
              />
              {/* 6.0s marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#24C87F] z-20"
                style={{
                  left: `${(6.0 / config.totalDuration) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
            <span>0.0s (In)</span>
            <span style={{ marginLeft: '12%' }}>1.5s (Revelado)</span>
            <span style={{ marginLeft: '45%' }}>6.0s (Recogida)</span>
            <span>7.0s (Fin)</span>
          </div>
        </div>

        {/* Playback Controls & Time display */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 pt-1 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#24C87F] hover:bg-[#1fb874] text-white font-bold transition shadow-md"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 transition border border-slate-200 shadow-sm"
              title="Reiniciar animación"
            >
              <RotateCcw className="w-4 h-4 text-slate-700" />
            </button>

            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 rounded-xl transition border shadow-sm ${
                isLooping
                  ? 'bg-[#24C87F] text-white border-[#24C87F] font-bold'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={isLooping ? 'Bucle activado' : 'Bucle desactivado'}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Time Code */}
          <div className="flex items-center gap-2 font-mono text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#24C87F]" />
            <span className="text-[#188e5a] font-bold">{currentTime.toFixed(2)}s</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">{config.totalDuration.toFixed(2)}s</span>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-sm">
            {[0.5, 1, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition ${
                  playbackSpeed === speed
                    ? 'bg-[#24C87F] text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
