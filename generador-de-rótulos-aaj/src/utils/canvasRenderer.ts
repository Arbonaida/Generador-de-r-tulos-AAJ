import { LowerThirdConfig } from '../types';
import { calculateAnimationStates } from '../components/LowerThirdGraphic';

export async function renderLowerThirdFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number, // e.g., 1080
  height: number, // e.g., 1920
  currentTime: number, // 0.0 to 7.0
  config: LowerThirdConfig,
  loadedLogoImg: HTMLImageElement | null,
  bgImgOrVideo: HTMLImageElement | HTMLVideoElement | null = null,
  drawBackground: boolean = false,
  bgColor: string = 'transparent'
) {
  // Always reset matrix transform to identity before drawing frame
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Optionally draw background image, video frame, or solid/gradient color
  if (drawBackground) {
    if (bgImgOrVideo) {
      ctx.drawImage(bgImgOrVideo, 0, 0, width, height);
    } else if (bgColor !== 'transparent') {
      if (bgColor.startsWith('linear-gradient')) {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        if (bgColor.includes('#022c22')) {
          grad.addColorStop(0, '#022c22');
          grad.addColorStop(0.5, '#064e3b');
          grad.addColorStop(1, '#0f172a');
        } else if (bgColor.includes('#334155')) {
          grad.addColorStop(0, '#334155');
          grad.addColorStop(1, '#0f172a');
        } else {
          grad.addColorStop(0, '#1e293b');
          grad.addColorStop(1, '#0f172a');
        }
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = bgColor;
      }
      ctx.fillRect(0, 0, width, height);
    }
  }

  // Animation calculation
  const { squareOffsetPx, whiteProgress, textOpacity } = calculateAnimationStates(
    currentTime,
    config
  );

  // Position calculations relative to 1080x1920 base
  const bottomPx = (height * config.bottomPercent) / 100;
  const leftPx = (width * config.leftPercent) / 100;
  const squareSize = config.squareSize * config.overallScale;

  const titleFontSize = Math.round(28 * config.titleSizeRatio * config.overallScale);
  const subtitleFontSize = Math.round(18 * config.subtitleSizeRatio * config.overallScale);
  const padX = Math.round(24 * config.overallScale);

  // Y coordinate (bottom aligned)
  const baseY = height - bottomPx - squareSize;
  const baseX = leftPx + squareOffsetPx;

  // Save state for group translation
  ctx.save();
  ctx.translate(baseX, baseY);

  // 1. Draw Left Square (Cuadrado Verde / Imagen)
  ctx.save();
  // Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  ctx.fillStyle = config.squareBgColor;
  ctx.fillRect(0, 0, squareSize, squareSize);
  ctx.restore();

  // Draw Logo Image or Initials inside Square
  if (config.useImage && loadedLogoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, squareSize, squareSize);
    ctx.clip();
    ctx.drawImage(loadedLogoImg, 0, 0, squareSize, squareSize);
    ctx.restore();
  } else if (!config.useImage) {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${Math.round(squareSize * 0.38)}px "Clash Display", "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      config.squareInitials || 'A',
      squareSize / 2,
      squareSize / 2 + 2
    );
    ctx.restore();
  }

  // 2. Measure Text to compute White Rectangle Width
  ctx.save();
  ctx.font = `700 ${titleFontSize}px "Clash Display", "Plus Jakarta Sans", sans-serif`;
  const titleMetrics = ctx.measureText(config.title || 'Carlos Fernández');

  ctx.font = `500 ${subtitleFontSize}px "Clash Display", "Plus Jakarta Sans", sans-serif`;
  const subtitleMetrics = ctx.measureText(config.subtitle || 'Portavoz de Adelante Jerez');
  ctx.restore();

  const textWidth = Math.max(titleMetrics.width, subtitleMetrics.width);
  const totalWhiteWidth = textWidth + padX * 2.2;

  // 3. Draw Right White Block (#FFFFFF) with clip reveal
  if (whiteProgress > 0) {
    const currentWhiteWidth = totalWhiteWidth * whiteProgress;

    ctx.save();
    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = config.whiteBlockBgColor;
    ctx.fillRect(squareSize, 0, currentWhiteWidth, squareSize);
    ctx.restore();

    // Clip text inside current white block
    ctx.save();
    ctx.beginPath();
    ctx.rect(squareSize, 0, currentWhiteWidth, squareSize);
    ctx.clip();

    // Draw Texts
    if (textOpacity > 0) {
      const textX = squareSize + padX + (1 - textOpacity) * -10;
      const centerY = squareSize / 2;

      ctx.globalAlpha = textOpacity;
      ctx.fillStyle = config.textColor;

      // Line 1: Title (Bold)
      ctx.font = `700 ${titleFontSize}px "Clash Display", "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(config.title || 'Carlos Fernández', textX, centerY + 2);

      // Line 2: Subtitle (Medium)
      ctx.font = `500 ${subtitleFontSize}px "Clash Display", "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(
        config.subtitle || 'Portavoz de Adelante Jerez',
        textX,
        centerY + 6
      );
    }
    ctx.restore();
  }

  ctx.restore();
}
