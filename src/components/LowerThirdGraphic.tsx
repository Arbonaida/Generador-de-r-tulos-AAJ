import React from 'react';
import { LowerThirdConfig } from '../types';
import { User, Sparkles, Building2, Bookmark } from 'lucide-react';

interface Props {
  config: LowerThirdConfig;
  currentTime: number; // in seconds 0.0 to 7.0
  scale?: number; // scaling factor for responsive viewport
}

// Ease out cubic helper
function easeOutCubic(x: number): number {
  return Math.max(0, Math.min(1, 1 - Math.pow(1 - x, 3)));
}

// Ease in cubic helper
function easeInCubic(x: number): number {
  return Math.max(0, Math.min(1, x * x * x));
}

// Ease in-out cubic helper
function easeInOutCubic(x: number): number {
  return Math.max(
    0,
    Math.min(
      1,
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
    )
  );
}

export function calculateAnimationStates(t: number, config: LowerThirdConfig) {
  // Keyframes timestamps
  const slideInEnd = config.slideInDuration; // default 0.6s
  const revealStart = Math.max(0.3, slideInEnd - 0.2); // start white block reveal slightly before square lands for organic transition
  const revealEnd = config.slideInDuration + config.revealDuration; // default 1.5s
  
  const holdEnd = config.holdEndTime; // default 6.0s
  const retractEnd = holdEnd + 0.6; // default 6.6s
  const totalDuration = config.totalDuration; // default 7.0s

  // 1. Square X Translation (in pixels, offscreen to left is e.g. -350px)
  let squareOffsetPx = 0;
  if (t < slideInEnd) {
    const progress = t / slideInEnd;
    const eased = easeInOutCubic(progress);
    squareOffsetPx = (1 - eased) * -350;
  } else if (t <= holdEnd) {
    squareOffsetPx = 0;
  } else if (t <= totalDuration) {
    const slideOutStart = holdEnd + 0.3;
    if (t < slideOutStart) {
      squareOffsetPx = 0;
    } else {
      const progress = (t - slideOutStart) / (totalDuration - slideOutStart);
      const eased = easeInCubic(progress);
      squareOffsetPx = eased * -350;
    }
  } else {
    squareOffsetPx = -350;
  }

  // 2. White Block Reveal Progress (0.0 to 1.0)
  let whiteProgress = 0;
  if (t < revealStart) {
    whiteProgress = 0;
  } else if (t <= revealEnd) {
    const progress = (t - revealStart) / (revealEnd - revealStart);
    whiteProgress = easeOutCubic(progress);
  } else if (t <= holdEnd) {
    whiteProgress = 1.0;
  } else if (t <= retractEnd) {
    const progress = (t - holdEnd) / (retractEnd - holdEnd);
    whiteProgress = 1.0 - easeInCubic(progress);
  } else {
    whiteProgress = 0;
  }

  // 3. Text Opacity & Slight Shift for ultra-crisp reveal
  let textOpacity = 0;
  if (whiteProgress > 0.1) {
    textOpacity = Math.min(1, (whiteProgress - 0.1) / 0.5);
  }

  return {
    squareOffsetPx,
    whiteProgress,
    textOpacity,
  };
}

export const LowerThirdGraphic: React.FC<Props> = ({
  config,
  currentTime,
  scale = 1.0,
}) => {
  const { squareOffsetPx, whiteProgress, textOpacity } = calculateAnimationStates(
    currentTime,
    config
  );

  const squareSizePx = config.squareSize * config.overallScale * scale;
  
  // Font sizes scaled according to config
  const titleFontSize = Math.round(28 * config.titleSizeRatio * config.overallScale * scale);
  const subtitleFontSize = Math.round(18 * config.subtitleSizeRatio * config.overallScale * scale);
  const padY = Math.round(16 * config.overallScale * scale);
  const padX = Math.round(24 * config.overallScale * scale);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: `${config.bottomPercent}%`,
        left: `${config.leftPercent}%`,
        display: 'flex',
        alignItems: 'center',
        zIndex: 20,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Container wrapper that moves with square */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          transform: `translateX(${squareOffsetPx * scale}px)`,
          transition: 'none', // Driven smoothly by frame timestamp
        }}
      >
        {/* Bloque Izquierdo: Cuadrado Verde / Imagen */}
        <div
          style={{
            width: `${squareSizePx}px`,
            height: `${squareSizePx}px`,
            backgroundColor: config.squareBgColor,
            flexShrink: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {config.useImage && config.squareImage ? (
            <img
              src={config.squareImage}
              alt="Logo/Foto"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white">
              <span
                style={{
                  fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: `${Math.round(squareSizePx * 0.38)}px`,
                  color: '#FFFFFF',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                {config.squareInitials || 'A'}
              </span>
            </div>
          )}
        </div>

        {/* Bloque Derecho: Rectángulo Blanco (#FFFFFF) */}
        <div
          style={{
            height: `${squareSizePx}px`,
            backgroundColor: config.whiteBlockBgColor,
            color: config.textColor,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: `${padX}px`,
            paddingRight: `${Math.round(padX * 1.4)}px`,
            paddingTop: `${padY}px`,
            paddingBottom: `${padY}px`,
            transformOrigin: 'left center',
            // Horizontal reveal clip-path from left to right
            clipPath: `inset(0 ${(1 - whiteProgress) * 100}% 0 0)`,
            boxShadow: whiteProgress > 0.05 ? '0 8px 24px rgba(0, 0, 0, 0.15)' : 'none',
            whiteSpace: 'nowrap',
            zIndex: 5,
            position: 'relative',
          }}
        >
          <div
            style={{
              opacity: textOpacity,
              transition: 'none',
              transform: `translateX(${(1 - textOpacity) * -12}px)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Texto Principal (Línea 1): Clash Display Bold, #004242 */}
            <div
              style={{
                fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                color: config.textColor,
                fontSize: `${titleFontSize}px`,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              {config.title || 'Carlos Fernández'}
            </div>

            {/* Subtexto (Línea 2): Clash Display Medium, #004242 */}
            <div
              style={{
                fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
                color: config.textColor,
                fontSize: `${subtitleFontSize}px`,
                lineHeight: 1.2,
                marginTop: `${Math.max(2, Math.round(4 * scale))}px`,
                opacity: 0.9,
              }}
            >
              {config.subtitle || 'Portavoz de Adelante Jerez'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
