import React, { useState, useEffect, useRef } from 'react';
import { LowerThirdConfig, SampleBackground, ActiveTab } from './types';
import { DEFAULT_CONFIG, SAMPLE_BACKGROUNDS } from './data/defaults';
import { Header } from './components/Header';
import { PreviewCanvas } from './components/PreviewCanvas';
import { EditorPanel } from './components/EditorPanel';
import { ExportModal } from './components/ExportModal';
import { Sparkles, Info, CheckCircle2, Sliders, Play, RotateCcw } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<LowerThirdConfig>(DEFAULT_CONFIG);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const [selectedBg, setSelectedBg] = useState<SampleBackground>(SAMPLE_BACKGROUNDS[0]);
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [customBgType, setCustomBgType] = useState<'image' | 'video' | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('text');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Precision animation clock
  useEffect(() => {
    const updateAnimation = (now: number) => {
      if (lastTimeRef.current !== null && isPlaying) {
        const deltaSec = ((now - lastTimeRef.current) / 1000) * playbackSpeed;
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + deltaSec;
          if (nextTime >= config.totalDuration) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return config.totalDuration;
            }
          }
          return nextTime;
        });
      }
      lastTimeRef.current = now;

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(updateAnimation);
      }
    };

    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(updateAnimation);
    } else {
      lastTimeRef.current = null;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, isLooping, playbackSpeed, config.totalDuration]);

  // Handle uploading custom logo/image for square
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setConfig((prev) => ({
          ...prev,
          squareImage: result,
          useImage: true,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setConfig((prev) => ({
      ...prev,
      squareImage: null,
      useImage: false,
    }));
  };

  // Handle uploading custom background (video or image)
  const handleUploadCustomBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      const url = URL.createObjectURL(file);
      setCustomBgUrl(url);
      setCustomBgType(isVid ? 'video' : 'image');
    }
  };

  const handleClearCustomBg = () => {
    if (customBgUrl) {
      URL.revokeObjectURL(customBgUrl);
    }
    setCustomBgUrl(null);
    setCustomBgType(null);
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePlayAnimation = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onPlayAnimation={handlePlayAnimation}
        onResetDefaults={handleResetDefaults}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1700px] w-full mx-auto">
        {/* Left/Middle Column: 9:16 Video Preview Viewport */}
        <div className="lg:col-span-7 flex flex-col lg:h-[780px] h-[580px] sm:h-[640px]">
          <PreviewCanvas
            config={config}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            selectedBg={selectedBg}
            customBgUrl={customBgUrl}
            customBgType={customBgType}
            onUploadCustomBg={handleUploadCustomBg}
            onClearCustomBg={handleClearCustomBg}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            isLooping={isLooping}
            setIsLooping={setIsLooping}
            previewRef={previewRef}
          />
        </div>

        {/* Right Column: Customization & Specs Controls Panel */}
        <div className="lg:col-span-5 flex flex-col lg:h-[780px] h-auto gap-4">
          <EditorPanel
            config={config}
            setConfig={setConfig}
            selectedBg={selectedBg}
            setSelectedBg={setSelectedBg}
            sampleBackgrounds={SAMPLE_BACKGROUNDS}
            onUploadImage={handleUploadImage}
            onClearImage={handleClearImage}
            onResetDefaults={handleResetDefaults}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Quick Specifications Box */}
          <div className="p-4 bg-slate-900/80 border border-slate-800/80 rounded-2xl text-xs text-slate-300 space-y-2 shrink-0">
            <div className="flex items-center gap-2 font-semibold text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Especificaciones de Animación Aplicadas</span>
            </div>

            <ul className="space-y-1 text-slate-400 pl-6 list-disc text-[11px]">
              <li>
                <strong className="text-slate-200">0.0s - 1.5s (Entrada):</strong> Deslizamiento del cuadrado verde + despliegue horizontal del bloque blanco (#FFFFFF) con revelado de texto de izquierda a derecha.
              </li>
              <li>
                <strong className="text-slate-200">1.5s - 6.0s (Pausa):</strong> Rótulo estático y perfectamente legible.
              </li>
              <li>
                <strong className="text-slate-200">6.0s - 7.0s (Salida):</strong> Recogida de derecha a izquierda tras el cuadrado verde y deslizamiento de salida.
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
        selectedBg={selectedBg}
        customBgUrl={customBgUrl}
        customBgType={customBgType}
      />
    </div>
  );
}
