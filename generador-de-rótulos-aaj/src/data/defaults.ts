import { LowerThirdConfig, SampleBackground } from '../types';

export const DEFAULT_CONFIG: LowerThirdConfig = {
  title: 'Carlos Fernández',
  subtitle: 'Portavoz de Adelante Jerez',
  textColor: '#004242',
  titleSizeRatio: 1,
  subtitleSizeRatio: 1,

  squareBgColor: '#004242',
  squareImage: null,
  squareInitials: 'CF',
  useImage: false,

  whiteBlockBgColor: '#FFFFFF',

  bottomPercent: 16,
  leftPercent: 6,
  overallScale: 1.0,
  squareSize: 130,

  slideInDuration: 0.6,
  revealDuration: 0.9,
  holdEndTime: 6.0,
  totalDuration: 7.0,
};

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
