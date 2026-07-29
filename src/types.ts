export interface SavedProfile {
  id: string;
  name: string;
  createdAt: number;
  config: LowerThirdConfig;
  isDefault?: boolean;
}

export interface LowerThirdConfig {
  // Text fields
  title: string; // Line 1
  subtitle: string; // Line 2
  textColor: string; // Default: #004242
  titleSizeRatio: number; // Font size multiplier
  subtitleSizeRatio: number; // Subtitle size multiplier

  // Graphic elements
  squareBgColor: string; // Default: #004242 or green
  squareImage: string | null; // Data URL or URL for left square
  squareInitials: string; // Fallback initials if no image
  useImage: boolean;
  
  whiteBlockBgColor: string; // Default: #FFFFFF
  
  // Position & Layout in 9:16 (1080x1920)
  bottomPercent: number; // e.g., 18% from bottom
  leftPercent: number; // e.g., 6% from left
  overallScale: number; // Scale multiplier (0.8 - 1.5)
  squareSize: number; // Size in px (e.g., 140px)
  
  // Animation timings in seconds
  slideInDuration: number; // 0s - 0.7s
  revealDuration: number; // 0.7s - 1.5s
  holdEndTime: number; // 6.0s
  totalDuration: number; // 7.0s
}

export interface SampleBackground {
  id: string;
  name: string;
  type: 'image' | 'video' | 'gradient' | 'transparent' | 'color';
  url: string;
}

export type ActiveTab = 'text' | 'graphic' | 'position' | 'timing' | 'background';
