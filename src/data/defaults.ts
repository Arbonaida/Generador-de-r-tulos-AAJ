import { LowerThirdConfig, SampleBackground, SavedProfile } from '../types';

export const DEFAULT_CONFIG: LowerThirdConfig = {
  title: 'Carlos Fernández',
  subtitle: 'Portavoz de Adelante Jerez',
  textColor: '#004242',
  titleSizeRatio: 1,
  subtitleSizeRatio: 1,

  squareBgColor: '#24C87F',
  squareImage: '/logo-aaj.jpg',
  squareInitials: 'AAJ',
  useImage: true,

  whiteBlockBgColor: '#FFFFFF',

  bottomPercent: 16,
  leftPercent: 7,
  overallScale: 1.0,
  squareSize: 105,

  slideInDuration: 0.6,
  revealDuration: 0.9,
  holdEndTime: 6.0,
  totalDuration: 7.0,
};

export const DEFAULT_PROFILES: SavedProfile[] = [
  {
    id: 'preset-coordinadora-local',
    name: 'Miembros de Coordinadora Local',
    createdAt: Date.now(),
    isDefault: true,
    config: {
      ...DEFAULT_CONFIG,
      title: 'Nombre y Apellidos',
      subtitle: 'Miembro de Coordinadora Local Jerez',
      squareImage: '/logo-aaj.jpg',
      useImage: true,
    },
  },
  {
    id: 'preset-portavoces',
    name: 'Portavoces',
    createdAt: Date.now() - 1000,
    isDefault: true,
    config: {
      ...DEFAULT_CONFIG,
      title: 'Carlos Fernández',
      subtitle: 'Portavoz de Adelante Jerez',
      squareImage: '/logo-aaj.jpg',
      useImage: true,
    },
  },
];

export const SAMPLE_BACKGROUNDS: SampleBackground[] = [
  {
    id: 'solid-black',
    name: 'Fondo Negro Sólido',
    type: 'color',
    url: '#000000',
  },
  {
    id: 'solid-custom',
    name: 'Color Sólido Personalizado',
    type: 'color',
    url: '#1e293b',
  },
  {
    id: 'press',
    name: 'Rueda de Prensa (Vídeo Vertical)',
    type: 'gradient',
    url: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  },
  {
    id: 'city',
    name: 'Fondo Urbano / Entrevista',
    type: 'gradient',
    url: 'linear-gradient(180deg, #334155 0%, #0f172a 100%)',
  },
  {
    id: 'green-studio',
    name: 'Estudio de Grabación',
    type: 'gradient',
    url: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)',
  },
  {
    id: 'transparent',
    name: 'Transparente (Cuadrícula)',
    type: 'transparent',
    url: 'transparent',
  },
];
