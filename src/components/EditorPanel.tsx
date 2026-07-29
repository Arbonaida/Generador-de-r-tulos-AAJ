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
  UserCheck,
  Megaphone,
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
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl text-slate-900">
      {/* Tab Navigation Header */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50 p-1.5 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'text'
              ? 'bg-[#24C87F] text-white font-bold shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Type className={`w-4 h-4 ${activeTab === 'text' ? 'text-white' : 'text-slate-700'}`} />
          <span>Textos</span>
        </button>

        <button
          onClick={() => setActiveTab('graphic')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'graphic'
              ? 'bg-[#24C87F] text-white font-bold shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Square className={`w-4 h-4 ${activeTab === 'graphic' ? 'text-white' : 'text-slate-700'}`} />
          <span>Bloques y Logo</span>
        </button>

        <button
          onClick={() => setActiveTab('position')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'position'
              ? 'bg-[#24C87F] text-white font-bold shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Layout className={`w-4 h-4 ${activeTab === 'position' ? 'text-white' : 'text-slate-700'}`} />
          <span>Posición</span>
        </button>

        <button
          onClick={() => setActiveTab('background')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'background'
              ? 'bg-[#24C87F] text-white font-bold shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Video className={`w-4 h-4 ${activeTab === 'background' ? 'text-white' : 'text-slate-700'}`} />
          <span>Fondo</span>
        </button>
      </div>

      {/* Tab Contents Scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* TAB 1: TEXTS */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            {/* Quick Presets Selector */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Presets Rápidos:</span>
                <span className="text-[10px] text-slate-500 font-normal">Aplicar plantilla</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    updateConfig('subtitle', 'Miembro Coordinadora Local Jerez');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                    config.subtitle === 'Miembro Coordinadora Local Jerez'
                      ? 'border-[#24C87F] bg-[#24C87F]/10 ring-2 ring-[#24C87F] font-bold text-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#24C87F] shrink-0" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold block text-slate-900">Coordinadora Local</span>
                    <span className="text-[10px] text-slate-500 truncate block">Miembro Coordinadora Local Jerez</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    updateConfig('title', 'Carlos Fernández');
                    updateConfig('subtitle', 'Portavoz de Adelante Jerez');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                    config.subtitle === 'Portavoz de Adelante Jerez'
                      ? 'border-[#24C87F] bg-[#24C87F]/10 ring-2 ring-[#24C87F] font-bold text-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Megaphone className="w-4 h-4 text-[#24C87F] shrink-0" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold block text-slate-900">Portavoces</span>
                    <span className="text-[10px] text-slate-500 truncate block">Carlos Fernández / Portavoz</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-2 flex items-center justify-between">
                <span>Texto Principal (Línea 1)</span>
                <span className="text-[10px] text-[#188e5a] font-mono bg-[#24C87F]/10 px-1.5 py-0.5 rounded border border-[#24C87F]/30 font-bold">Clash Display Bold (700)</span>
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="Ej: Magdalena Bello"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-[#24C87F] focus:ring-1 focus:ring-[#24C87F] transition shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-2 flex items-center justify-between">
                <span>Subtexto / Cargo (Línea 2)</span>
                <span className="text-[10px] text-[#188e5a] font-mono bg-[#24C87F]/10 px-1.5 py-0.5 rounded border border-[#24C87F]/30 font-bold">Clash Display Medium (500)</span>
              </label>
              <input
                type="text"
                value={config.subtitle}
                onChange={(e) => updateConfig('subtitle', e.target.value)}
                placeholder="Ej: Miembro Coordinadora Local Jerez"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-[#24C87F] focus:ring-1 focus:ring-[#24C87F] transition shadow-sm"
              />
            </div>

            {/* Text Color Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-2">
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
                  className="w-28 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 shadow-sm"
                />
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 mt-3">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => updateConfig('textColor', p.value)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-[11px] text-slate-800 border border-slate-200 transition shadow-sm"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: p.value }}
                    />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Scaling */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div>
                <div className="flex justify-between text-xs text-slate-900 font-medium mb-1.5">
                  <span>Tamaño Nombre Principal</span>
                  <span className="font-mono text-[#188e5a] font-bold">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#24C87F]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-900 font-medium mb-1.5">
                  <span>Tamaño Subtexto</span>
                  <span className="font-mono text-[#188e5a] font-bold">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#24C87F]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GRAPHICS & LOGO */}
        {activeTab === 'graphic' && (
          <div className="space-y-6">
            {/* Left Block Image / Logo */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-slate-900 shadow-sm">
              <label className="block text-xs font-semibold text-slate-900">
                Bloque Izquierdo (Cuadrado / Imagen)
              </label>

              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden border border-slate-300 shadow-md shrink-0 bg-[#24C87F]"
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
                  <label className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-[#24C87F] text-white hover:bg-[#1fb874] text-xs font-bold cursor-pointer transition shadow-md">
                    <Upload className="w-4 h-4 text-white" />
                    <span>Subir Tu Propio Logo</span>
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
                      className="w-full text-center text-xs text-slate-600 hover:text-slate-800 py-1 underline transition"
                    >
                      Quitar imagen (Usar iniciales)
                    </button>
                  )}
                </div>
              </div>

              {/* Predefined Logos Selector */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-900 mb-2">
                  Logos Predefinidos (Selección Rápida):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      updateConfig('squareImage', '/logo-aaj.jpg');
                      updateConfig('useImage', true);
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-left transition ${
                      config.useImage && config.squareImage === '/logo-aaj.jpg'
                        ? 'border-[#24C87F] bg-[#24C87F]/10 ring-2 ring-[#24C87F] font-bold text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src="/logo-aaj.jpg"
                      alt="Logo AAJ Oficial"
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold block text-slate-900">Estrella AAJ</span>
                      <span className="text-[10px] text-slate-500">Logo Oficial</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      updateConfig('squareImage', '/logo-aaj-star.svg');
                      updateConfig('useImage', true);
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-left transition ${
                      config.useImage && config.squareImage === '/logo-aaj-star.svg'
                        ? 'border-[#24C87F] bg-[#24C87F]/10 ring-2 ring-[#24C87F] font-bold text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src="/logo-aaj-star.svg"
                      alt="Logo Vectorial AAJ"
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0 bg-[#24C87F]"
                    />
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold block text-slate-900">Vectorial SVG</span>
                      <span className="text-[10px] text-slate-500">Formato Limpio</span>
                    </div>
                  </button>
                </div>
              </div>

              {!config.useImage && (
                <div className="pt-2">
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Iniciales / Símbolo si no hay imagen:
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={config.squareInitials}
                    onChange={(e) => updateConfig('squareInitials', e.target.value)}
                    placeholder="Ej: CF"
                    className="w-24 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-bold uppercase shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Left Square Background Color */}
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-2">
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
                  className="w-28 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 shadow-sm"
                />
              </div>
            </div>

            {/* Right Block Background Color */}
            <div className="pt-4 border-t border-slate-200">
              <label className="block text-xs font-semibold text-slate-900 mb-2">
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
                  className="w-28 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POSITION & SCALE */}
        {activeTab === 'position' && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-slate-900 font-medium mb-1.5">
                <span>Posición Vertical (% desde abajo)</span>
                <span className="font-mono text-[#188e5a] font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#24C87F]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-medium mb-1.5">
                <span>Margen Izquierdo (% desde la izquierda)</span>
                <span className="font-mono text-[#188e5a] font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#24C87F]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-medium mb-1.5">
                <span>Escala General del Rótulo</span>
                <span className="font-mono text-[#188e5a] font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#24C87F]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-medium mb-1.5">
                <span>Altura del Rótulo / Altura del Cuadrado</span>
                <span className="font-mono text-[#188e5a] font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#24C87F]"
              />
            </div>
          </div>
        )}

        {/* TAB 4: SAMPLE BACKGROUNDS & SOLID COLOR SELECTOR */}
        {activeTab === 'background' && (
          <div className="space-y-6">
            {/* Dedicated Solid Color Picker Section */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-slate-900 shadow-sm">
              <label className="block text-xs font-semibold text-slate-900 flex items-center justify-between">
                <span>Selector de Color Sólido</span>
                <span className="text-[10px] text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
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
                  className="w-32 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 uppercase focus:outline-none focus:border-[#24C87F]"
                />
              </div>

              {/* Quick Solid Color Presets */}
              <div className="space-y-2">
                <span className="block text-[11px] font-medium text-slate-700">
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
                          ? 'bg-[#24C87F] text-white border-[#24C87F] font-bold'
                          : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
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
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                Selecciona una plantilla o fondo de prueba para comprobar el contraste en formato vertical 9:16:
              </p>

              <div className="grid grid-cols-2 gap-3">
                {sampleBackgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg)}
                    className={`p-3 rounded-xl border flex flex-col gap-2 text-left transition ${
                      selectedBg.id === bg.id
                        ? 'border-[#24C87F] bg-[#24C87F]/10 text-slate-900 ring-2 ring-[#24C87F] font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-[#24C87F]/50'
                    }`}
                  >
                    <div
                      className="w-full h-16 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200"
                      style={{ background: bg.url }}
                    >
                      {bg.type === 'transparent' && (
                        <span className="text-[10px] text-slate-800 font-mono bg-white/80 px-2 py-0.5 rounded shadow-sm">
                          Sin Fondo
                        </span>
                      )}
                      {bg.type === 'color' && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            bg.url === '#ffffff' ? 'text-slate-900 bg-slate-200' : 'text-white bg-black/60'
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
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold transition shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span>Restablecer Ajustes Originales</span>
        </button>
      </div>
    </div>
  );
};
