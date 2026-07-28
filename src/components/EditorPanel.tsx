import React, { useState } from 'react';
import { LowerThirdConfig, SampleBackground, ActiveTab } from '../types';
import {
  Type,
  Palette,
  Layout,
  Clock,
  Video,
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  Maximize,
  Square,
  FileText,
} from 'lucide-react';

interface Props {
  config: LowerThirdConfig;
  setConfig: React.Dispatch<React.SetStateAction<LowerThirdConfig>>;
  selectedBg: SampleBackground;
  setSelectedBg: (bg: SampleBackground) => void;
  sampleBackgrounds: SampleBackground[];
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onResetDefaults: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const COLOR_PRESETS = [
  { name: 'Verde Adelante', value: '#004242' },
  { name: 'Verde Mar', value: '#006652' },
  { name: 'Azul Marino', value: '#0f172a' },
  { name: 'Rojo Corporativo', value: '#991b1b' },
  { name: 'Gris Oscuro', value: '#1e293b' },
  { name: 'Negro Puro', value: '#000000' },
];

export const EditorPanel: React.FC<Props> = ({
  config,
  setConfig,
  selectedBg,
  setSelectedBg,
  sampleBackgrounds,
  onUploadImage,
  onClearImage,
  onResetDefaults,
  activeTab,
  setActiveTab,
}) => {
  const updateConfig = (key: keyof LowerThirdConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Tab Navigation Header */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'text'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Type className="w-4 h-4 text-teal-400" />
          <span>Textos</span>
        </button>

        <button
          onClick={() => setActiveTab('graphic')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'graphic'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Square className="w-4 h-4 text-teal-400" />
          <span>Bloques y Logo</span>
        </button>

        <button
          onClick={() => setActiveTab('position')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'position'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layout className="w-4 h-4 text-teal-400" />
          <span>Posición</span>
        </button>

        <button
          onClick={() => setActiveTab('background')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'background'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Video className="w-4 h-4 text-teal-400" />
          <span>Fondo</span>
        </button>
      </div>

      {/* Tab Contents Scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* TAB 1: TEXTS */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Texto Principal (Línea 1)</span>
                <span className="text-[10px] text-teal-400 font-mono">Clash Display Bold</span>
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="Ej: Carlos Fernández"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Subtexto / Cargo (Línea 2)</span>
                <span className="text-[10px] text-teal-400 font-mono">Clash Display Light</span>
              </label>
              <input
                type="text"
                value={config.subtitle}
                onChange={(e) => updateConfig('subtitle', e.target.value)}
                placeholder="Ej: Portavoz de Adelante Jerez"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>

            {/* Text Color Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Color de los Textos
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.textColor}
                  onChange={(e) => updateConfig('textColor', e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer overflow-hidden p-0"
                />
                <input
                  type="text"
                  value={config.textColor}
                  onChange={(e) => updateConfig('textColor', e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200"
                />
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 mt-3">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => updateConfig('textColor', p.value)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-600"
                      style={{ backgroundColor: p.value }}
                    />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Scaling */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                  <span>Tamaño Nombre Principal</span>
                  <span className="font-mono text-teal-400">
                    {Math.round(config.titleSizeRatio * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.05"
                  value={config.titleSizeRatio}
                  onChange={(e) =>
                    updateConfig('titleSizeRatio', parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                  <span>Tamaño Subtexto</span>
                  <span className="font-mono text-teal-400">
                    {Math.round(config.subtitleSizeRatio * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.05"
                  value={config.subtitleSizeRatio}
                  onChange={(e) =>
                    updateConfig('subtitleSizeRatio', parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GRAPHICS & LOGO */}
        {activeTab === 'graphic' && (
          <div className="space-y-6">
            {/* Left Block Image / Logo */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <label className="block text-xs font-semibold text-slate-200">
                Bloque Izquierdo (Cuadrado / Imagen)
              </label>

              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden border border-slate-700 shadow-md shrink-0"
                  style={{ backgroundColor: config.squareBgColor }}
                >
                  {config.useImage && config.squareImage ? (
                    <img
                      src={config.squareImage}
                      alt="Logo Upload"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-white text-xl font-clash">
                      {config.squareInitials || 'CF'}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <label className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    <span>Subir Imagen / Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onUploadImage}
                    />
                  </label>

                  {config.squareImage && (
                    <button
                      onClick={onClearImage}
                      className="w-full text-center text-xs text-red-400 hover:text-red-300 py-1 transition"
                    >
                      Usar color sólido e iniciales
                    </button>
                  )}
                </div>
              </div>

              {!config.useImage && (
                <div className="pt-2">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Iniciales / Símbolo si no hay imagen:
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={config.squareInitials}
                    onChange={(e) => updateConfig('squareInitials', e.target.value)}
                    placeholder="Ej: CF"
                    className="w-24 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-bold uppercase"
                  />
                </div>
              )}
            </div>

            {/* Left Square Background Color */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Color del Cuadrado Izquierdo
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.squareBgColor}
                  onChange={(e) => updateConfig('squareBgColor', e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer overflow-hidden p-0"
                />
                <input
                  type="text"
                  value={config.squareBgColor}
                  onChange={(e) => updateConfig('squareBgColor', e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200"
                />
              </div>
            </div>

            {/* Right Block Background Color */}
            <div className="pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Color del Bloque Derecho (#FFFFFF)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.whiteBlockBgColor}
                  onChange={(e) => updateConfig('whiteBlockBgColor', e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer overflow-hidden p-0"
                />
                <input
                  type="text"
                  value={config.whiteBlockBgColor}
                  onChange={(e) => updateConfig('whiteBlockBgColor', e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POSITION & SCALE */}
        {activeTab === 'position' && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span>Posición Vertical (% desde abajo)</span>
                <span className="font-mono text-teal-400">
                  {config.bottomPercent}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={config.bottomPercent}
                onChange={(e) =>
                  updateConfig('bottomPercent', parseInt(e.target.value, 10))
                }
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span>Margen Izquierdo (% desde la izquierda)</span>
                <span className="font-mono text-teal-400">
                  {config.leftPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={config.leftPercent}
                onChange={(e) =>
                  updateConfig('leftPercent', parseInt(e.target.value, 10))
                }
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span>Escala General del Rótulo</span>
                <span className="font-mono text-teal-400">
                  {Math.round(config.overallScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={config.overallScale}
                onChange={(e) =>
                  updateConfig('overallScale', parseFloat(e.target.value))
                }
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span>Altura del Rótulo / Altura del Cuadrado</span>
                <span className="font-mono text-teal-400">
                  {config.squareSize}px
                </span>
              </div>
              <input
                type="range"
                min="90"
                max="180"
                step="5"
                value={config.squareSize}
                onChange={(e) =>
                  updateConfig('squareSize', parseInt(e.target.value, 10))
                }
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>
          </div>
        )}

        {/* TAB 4: SAMPLE BACKGROUNDS & SOLID COLOR SELECTOR */}
        {activeTab === 'background' && (
          <div className="space-y-6">
            {/* Dedicated Solid Color Picker Section */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <label className="block text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>Selector de Color Sólido</span>
                <span className="text-[10px] text-teal-400 font-mono">
                  {selectedBg.type === 'color' ? selectedBg.url : 'Personalizado'}
                </span>
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedBg.type === 'color' ? selectedBg.url : '#000000'}
                  onChange={(e) => {
                    const color = e.target.value;
                    setSelectedBg({
                      id: color === '#000000' ? 'solid-black' : 'solid-custom',
                      name: color === '#000000' ? 'Fondo Negro Sólido' : `Sólido (${color})`,
                      type: 'color',
                      url: color,
                    });
                  }}
                  className="w-12 h-12 rounded-xl bg-transparent border-0 cursor-pointer overflow-hidden p-0"
                />
                <input
                  type="text"
                  value={selectedBg.type === 'color' ? selectedBg.url : '#000000'}
                  onChange={(e) => {
                    const color = e.target.value;
                    setSelectedBg({
                      id: color === '#000000' ? 'solid-black' : 'solid-custom',
                      name: color === '#000000' ? 'Fondo Negro Sólido' : `Sólido (${color})`,
                      type: 'color',
                      url: color,
                    });
                  }}
                  className="w-32 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 uppercase focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Quick Solid Color Presets */}
              <div className="space-y-2">
                <span className="block text-[11px] font-medium text-slate-400">
                  Ajustes rápidos de color sólido:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Negro Sólido', value: '#000000' },
                    { name: 'Gris Oscuro', value: '#1e293b' },
                    { name: 'Blanco Sólido', value: '#ffffff' },
                    { name: 'Verde Croma', value: '#00ff00' },
                    { name: 'Azul Croma', value: '#0000ff' },
                    { name: 'Azul Marino', value: '#0f172a' },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() =>
                        setSelectedBg({
                          id: preset.value === '#000000' ? 'solid-black' : 'solid-custom',
                          name: preset.name,
                          type: 'color',
                          url: preset.value,
                        })
                      }
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition border ${
                        selectedBg.type === 'color' &&
                        selectedBg.url.toLowerCase() === preset.value.toLowerCase()
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-600 shrink-0"
                        style={{ backgroundColor: preset.value }}
                      />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Presets and Sample Backgrounds */}
            <div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Selecciona una plantilla o fondo de prueba para comprobar el contraste en formato vertical 9:16:
              </p>

              <div className="grid grid-cols-2 gap-3">
                {sampleBackgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg)}
                    className={`p-3 rounded-xl border flex flex-col gap-2 text-left transition ${
                      selectedBg.id === bg.id
                        ? 'border-teal-500 bg-teal-500/10 text-white ring-1 ring-teal-500'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-full h-16 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700/50"
                      style={{ background: bg.url }}
                    >
                      {bg.type === 'transparent' && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Sin Fondo
                        </span>
                      )}
                      {bg.type === 'color' && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            bg.url === '#ffffff' ? 'text-slate-900 bg-slate-200' : 'text-slate-300 bg-slate-900/80'
                          }`}
                        >
                          {bg.url}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium line-clamp-1">
                      {bg.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Reset */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Restablecer Ajustes Originales</span>
        </button>
      </div>
    </div>
  );
};
