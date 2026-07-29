import React, { useState, useEffect, useRef } from 'react';
import { LowerThirdConfig, SampleBackground, ActiveTab, SavedProfile } from './types';
import { DEFAULT_CONFIG, SAMPLE_BACKGROUNDS, DEFAULT_PROFILES } from './data/defaults';
import { Header } from './components/Header';
import { PreviewCanvas } from './components/PreviewCanvas';
import { EditorPanel } from './components/EditorPanel';
import { ExportModal } from './components/ExportModal';
import { ProfileManagerModal } from './components/ProfileManagerModal';

const LOCAL_STORAGE_PROFILES_KEY = 'aaj_rotulos_profiles_v1';

export default function App() {
  const [profiles, setProfiles] = useState<SavedProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load profiles from localStorage', e);
    }
    return DEFAULT_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(profiles[0]?.id || null);
  const [isProfilesOpen, setIsProfilesOpen] = useState<boolean>(false);

  const [config, setConfig] = useState<LowerThirdConfig>(() => {
    return profiles[0]?.config || DEFAULT_CONFIG;
  });

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

  // Persist profiles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.warn('Failed to save profiles to localStorage', e);
    }
  }, [profiles]);

  const handleSelectProfile = (profile: SavedProfile) => {
    setActiveProfileId(profile.id);
    setConfig(profile.config);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSaveProfile = (name: string) => {
    const newProfile: SavedProfile = {
      id: `custom-profile-${Date.now()}`,
      name,
      createdAt: Date.now(),
      config: { ...config },
      isDefault: false,
    };
    setProfiles((prev) => [newProfile, ...prev]);
    setActiveProfileId(newProfile.id);
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(null);
    }
  };

  const handleImportProfiles = (imported: SavedProfile[]) => {
    setProfiles((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const filteredNew = imported.filter((p) => p && p.id && p.config && !existingIds.has(p.id));
      return [...filteredNew, ...prev];
    });
  };

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

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#24C87F] selection:text-white">
      {/* Header */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onPlayAnimation={handlePlayAnimation}
        onResetDefaults={handleResetDefaults}
        onOpenProfiles={() => setIsProfilesOpen(true)}
        activeProfileName={activeProfile?.name}
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
        </div>
      </main>

      {/* Profile Manager Modal */}
      <ProfileManagerModal
        isOpen={isProfilesOpen}
        onClose={() => setIsProfilesOpen(false)}
        currentConfig={config}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={handleSelectProfile}
        onSaveProfile={handleSaveProfile}
        onDeleteProfile={handleDeleteProfile}
        onImportProfiles={handleImportProfiles}
      />

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
