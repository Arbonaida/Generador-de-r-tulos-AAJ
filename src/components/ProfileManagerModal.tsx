import React, { useState } from 'react';
import { LowerThirdConfig, SavedProfile } from '../types';
import {
  X,
  Plus,
  Bookmark,
  Check,
  Trash2,
  FolderOpen,
  User,
  Download,
  Upload,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: LowerThirdConfig;
  profiles: SavedProfile[];
  activeProfileId: string | null;
  onSelectProfile: (profile: SavedProfile) => void;
  onSaveProfile: (name: string) => void;
  onDeleteProfile: (id: string) => void;
  onImportProfiles: (profiles: SavedProfile[]) => void;
}

export const ProfileManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentConfig,
  profiles,
  activeProfileId,
  onSelectProfile,
  onSaveProfile,
  onDeleteProfile,
  onImportProfiles,
}) => {
  const [newProfileName, setNewProfileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [filterText, setFilterText] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    onSaveProfile(newProfileName.trim());
    setNewProfileName('');
    setIsCreating(false);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `perfiles_rotulos_aaj_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onImportProfiles(imported);
        }
      } catch (err) {
        alert('El archivo JSON no tiene un formato de perfiles válido.');
      }
    };
    reader.readAsText(file);
  };

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(filterText.toLowerCase()) ||
    p.config.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900 z-10 my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1c9860] border-b border-[#157c4f] flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl border border-white/20">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Gestor de Perfiles de Rótulo</h2>
              <p className="text-xs text-white/80">Guarda, carga y reutiliza configuraciones habituales</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 transition text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Actions: Save Current Profile */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Bookmark className="w-4 h-4 text-[#24C87F]" />
                <span>Guardar Configuración Actual como Perfil</span>
              </div>
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24C87F] hover:bg-[#1fb874] text-white text-xs font-bold shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Perfil</span>
                </button>
              )}
            </div>

            {isCreating ? (
              <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Ej: Portavoz Carlos (Conferencia)"
                  autoFocus
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#24C87F] focus:ring-1 focus:ring-[#24C87F]"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#24C87F] hover:bg-[#1fb874] text-white text-xs font-bold shadow-sm transition"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-[11px] text-slate-600">
                Configuración activa actual: <strong className="text-slate-800">"{currentConfig.title}"</strong> ({currentConfig.subtitle || 'Sin subtítulo'})
              </p>
            )}
          </div>

          {/* Search & Profiles List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Perfiles Disponibles ({filteredProfiles.length})</h3>
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Buscar perfil..."
                className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#24C87F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProfiles.map((p) => {
                const isActive = activeProfileId === p.id;
                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-xl border transition flex flex-col justify-between gap-3 relative group ${
                      isActive
                        ? 'border-[#24C87F] bg-[#24C87F]/10 ring-2 ring-[#24C87F]'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#24C87F] text-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                          {p.config.useImage && p.config.squareImage ? (
                            <img src={p.config.squareImage} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                            <span className="truncate">{p.name}</span>
                            {p.isDefault && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-200 text-slate-700 font-semibold shrink-0">
                                Oficial
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">{p.config.title}</p>
                        </div>
                      </div>

                      {isActive && (
                        <span className="p-1 bg-[#24C87F] text-white rounded-full shrink-0 shadow-sm">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Subtitle preview & Specs */}
                    <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono space-y-0.5">
                      <div className="truncate">Subtítulo: "{p.config.subtitle}"</div>
                      <div>Posición: Inf {p.config.bottomPercent}% | Izq {p.config.leftPercent}%</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          onSelectProfile(p);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          isActive
                            ? 'bg-[#24C87F] text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-[#24C87F] hover:text-white text-slate-800'
                        }`}
                      >
                        {isActive ? 'Perfil Aplicado' : 'Cargar Perfil'}
                      </button>

                      {!p.isDefault && (
                        <button
                          onClick={() => onDeleteProfile(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Eliminar perfil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Import / Export */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition shadow-sm"
              title="Exportar copia de seguridad de todos los perfiles"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Exportar JSON</span>
            </button>

            <label
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition shadow-sm cursor-pointer"
              title="Importar perfiles guardados"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Importar JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
