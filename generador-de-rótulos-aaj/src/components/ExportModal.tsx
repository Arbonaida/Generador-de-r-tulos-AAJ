import React, { useState, useEffect, useRef } from 'react';
import { LowerThirdConfig, SampleBackground } from '../types';
import { renderLowerThirdFrameToCanvas } from '../utils/canvasRenderer';
import { Download, Film, Image as ImageIcon, X, Check, Loader2, Video, Sparkles, AlertCircle } from 'lucide-react';
import * as Mp4Muxer from 'mp4-muxer';
import * as WebmMuxer from 'webm-muxer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: LowerThirdConfig;
  selectedBg: SampleBackground;
  customBgUrl: string | null;
  customBgType: 'image' | 'video' | null;
}

export const ExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  selectedBg,
  customBgUrl,
  customBgType,
}) => {
  const [exportType, setExportType] = useState<'mp4-bg' | 'mp4-transparent'>('mp4-bg');
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 420; // 7 seconds at 60 FPS
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsRendering(false);
      setProgress(0);
      setDownloadUrl(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Safe image loader that handles data URLs, blob URLs, and CORS properly
  const loadImage = (url: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      const isLocal = url.startsWith('data:') || url.startsWith('blob:');
      if (!isLocal) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback without crossOrigin
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = () => resolve(null);
        fallbackImg.src = url;
      };
      img.src = url;
    });
  };

  // Helper to load logo image element if configured
  const loadLogoImage = async (): Promise<HTMLImageElement | null> => {
    if (!config.useImage || !config.squareImage) return null;
    return loadImage(config.squareImage);
  };

  // Export PNG frame at t=3.0s (fully revealed state)
  const handleExportPNG = async () => {
    if (!hiddenCanvasRef.current) return;
    setIsRendering(true);
    setErrorMessage(null);
    setProgress(50);

    try {
      const canvas = hiddenCanvasRef.current;
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No se pudo inicializar el lienzo canvas');

      const logoImg = await loadLogoImage();
      await renderLowerThirdFrameToCanvas(
        ctx,
        1080,
        1920,
        3.0, // static revealed time
        config,
        logoImg,
        null,
        false
      );

      setProgress(100);
      const dataUrl = canvas.toDataURL('image/png');
      setDownloadUrl(dataUrl);
      const sanitizedTitle = (config.title || 'faldon').toLowerCase().replace(/\s+/g, '_');
      setDownloadFileName(`faldon_9x16_${sanitizedTitle}.png`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Error al exportar la imagen PNG. Inténtalo de nuevo.');
    } finally {
      setIsRendering(false);
    }
  };

  // Export MP4 using WebCodecs + mp4-muxer (in-memory canvas + createImageBitmap)
  const exportMp4WithWebCodecs = async (
    includeBg: boolean,
    logoImg: HTMLImageElement | null,
    bgElement: HTMLImageElement | null
  ) => {
    // Create an un-culled in-memory canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d', { alpha: !includeBg, willReadFrequently: true });
    if (!ctx) throw new Error('No se pudo obtener el contexto 2D');

    await document.fonts.ready;

    // Check supported H.264 / AVC or VP9 codec profiles
    const codecsToTry = ['avc1.42E01E', 'avc1.4d401f', 'avc1.640028', 'avc1'];
    let chosenCodec = 'avc1.42E01E';
    let codecSupported = false;

    for (const c of codecsToTry) {
      try {
        const res = await VideoEncoder.isConfigSupported({
          codec: c,
          width: 1080,
          height: 1920,
          bitrate: 14_000_000,
          framerate: 60,
        });
        if (res.supported) {
          chosenCodec = c;
          codecSupported = true;
          break;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!codecSupported) {
      // Try VP9 in MP4 container as secondary codec
      try {
        const vp9Res = await VideoEncoder.isConfigSupported({
          codec: 'vp09.00.10.08',
          width: 1080,
          height: 1920,
          bitrate: 14_000_000,
          framerate: 60,
        });
        if (vp9Res.supported) {
          chosenCodec = 'vp09.00.10.08';
          codecSupported = true;
        }
      } catch (e) {}
    }

    if (!codecSupported) {
      throw new Error('WebCodecs H.264/VP9 no está soportado en este entorno');
    }

    const muxerCodec = chosenCodec.startsWith('vp') ? 'vp9' : 'avc';
    const muxer = new Mp4Muxer.Muxer({
      target: new Mp4Muxer.ArrayBufferTarget(),
      video: {
        codec: muxerCodec,
        width: 1080,
        height: 1920,
      },
      fastStart: 'in-memory',
    });

    let encoderError: any = null;
    const encoder = new VideoEncoder({
      output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
      error: (e) => {
        console.error('WebCodecs VideoEncoder error:', e);
        encoderError = e;
      },
    });

    encoder.configure({
      codec: chosenCodec,
      width: 1080,
      height: 1920,
      bitrate: 14_000_000,
      framerate: 60,
    });

    const fps = 60;
    const frameDuration = 1 / fps;
    const frameDurationMicros = Math.round(1_000_000 / fps);
    const drawBackground = includeBg || exportType === 'mp4-transparent';
    const bgFill = includeBg
      ? selectedBg.type === 'color' || selectedBg.type === 'gradient'
        ? selectedBg.url
        : '#0f172a'
      : '#000000';

    for (let f = 0; f < totalFrames; f++) {
      if (encoderError) throw encoderError;

      const t = f * frameDuration;
      setCurrentFrame(f + 1);
      setProgress(Math.round(((f + 1) / totalFrames) * 100));

      await renderLowerThirdFrameToCanvas(
        ctx,
        1080,
        1920,
        t,
        config,
        logoImg,
        bgElement,
        drawBackground,
        bgFill
      );

      const timestampMicros = Math.round(f * frameDurationMicros);
      const bitmap = await createImageBitmap(canvas);
      const videoFrame = new VideoFrame(bitmap, {
        timestamp: timestampMicros,
        duration: frameDurationMicros,
      });

      const isKeyFrame = f % 60 === 0;
      encoder.encode(videoFrame, { keyFrame: isKeyFrame });
      videoFrame.close();
      bitmap.close();

      if (f % 15 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    await encoder.flush();
    muxer.finalize();

    const { buffer } = muxer.target;
    const blob = new Blob([buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);

    const sanitizedTitle = (config.title || 'faldon').toLowerCase().replace(/\s+/g, '_');
    const suffix = includeBg ? 'con_fondo' : 'overlay';
    setDownloadFileName(`faldon_9x16_${sanitizedTitle}_${suffix}.mp4`);
  };

  // Export WebM using WebCodecs + webm-muxer (Supports Alpha Transparency)
  const exportWebmWithWebCodecs = async (
    includeBg: boolean,
    logoImg: HTMLImageElement | null,
    bgElement: HTMLImageElement | null
  ) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true });
    if (!ctx) throw new Error('No se pudo obtener el contexto 2D');

    await document.fonts.ready;

    const vp9Codec = 'vp09.00.10.08';
    const muxer = new WebmMuxer.Muxer({
      target: new WebmMuxer.ArrayBufferTarget(),
      video: {
        codec: 'V_VP9',
        width: 1080,
        height: 1920,
        alpha: !includeBg,
      },
    });

    let encoderError: any = null;
    const encoder = new VideoEncoder({
      output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
      error: (e) => {
        console.error('WebCodecs VP9 VideoEncoder error:', e);
        encoderError = e;
      },
    });

    encoder.configure({
      codec: vp9Codec,
      width: 1080,
      height: 1920,
      bitrate: 14_000_000,
      framerate: 60,
      alpha: !includeBg ? 'keep' : 'discard',
    });

    const fps = 60;
    const frameDuration = 1 / fps;
    const frameDurationMicros = Math.round(1_000_000 / fps);
    const drawBackground = includeBg;
    const bgFill = includeBg
      ? selectedBg.type === 'color' || selectedBg.type === 'gradient'
        ? selectedBg.url
        : '#0f172a'
      : 'transparent';

    for (let f = 0; f < totalFrames; f++) {
      if (encoderError) throw encoderError;

      const t = f * frameDuration;
      setCurrentFrame(f + 1);
      setProgress(Math.round(((f + 1) / totalFrames) * 100));

      await renderLowerThirdFrameToCanvas(
        ctx,
        1080,
        1920,
        t,
        config,
        logoImg,
        bgElement,
        drawBackground,
        bgFill
      );

      const timestampMicros = Math.round(f * frameDurationMicros);
      const bitmap = await createImageBitmap(canvas);
      const videoFrame = new VideoFrame(bitmap, {
        timestamp: timestampMicros,
        duration: frameDurationMicros,
      });

      const isKeyFrame = f % 60 === 0;
      encoder.encode(videoFrame, { keyFrame: isKeyFrame });
      videoFrame.close();
      bitmap.close();

      if (f % 15 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    await encoder.flush();
    muxer.finalize();

    const { buffer } = muxer.target;
    const blob = new Blob([buffer], { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);

    const sanitizedTitle = (config.title || 'faldon').toLowerCase().replace(/\s+/g, '_');
    const suffix = includeBg ? 'con_fondo' : 'transparente';
    setDownloadFileName(`faldon_9x16_${sanitizedTitle}_${suffix}.webm`);
  };

  // Fallback Export Video using MediaRecorder with real-time clock pacing
  const exportVideoWithMediaRecorder = async (
    format: 'mp4' | 'webm',
    includeBg: boolean,
    logoImg: HTMLImageElement | null,
    bgElement: HTMLImageElement | null
  ) => {
    const canvas = hiddenCanvasRef.current!;
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d', { alpha: !includeBg });
    if (!ctx) throw new Error('No 2D canvas context');

    await document.fonts.ready;

    const stream = canvas.captureStream(60);

    let mimeType = 'video/webm;codecs=vp9';
    if (format === 'mp4') {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
        mimeType = 'video/mp4;codecs=avc1';
      } else if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      }
    } else {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      } else if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/webm')) {
        mimeType = 'video/webm';
      }
    }

    let mediaRecorder: MediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 16000000 });
    } catch (e) {
      mediaRecorder = new MediaRecorder(stream);
    }

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    return new Promise<void>((resolve, reject) => {
      mediaRecorder.onstop = () => {
        if (chunks.length === 0) {
          reject(new Error('No se generaron fotogramas de vídeo'));
          return;
        }
        const actualMime = mediaRecorder.mimeType || (format === 'mp4' ? 'video/mp4' : 'video/webm');
        const blob = new Blob(chunks, { type: actualMime });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        const sanitizedTitle = (config.title || 'faldon').toLowerCase().replace(/\s+/g, '_');
        const suffix = includeBg ? 'con_fondo' : 'overlay';
        setDownloadFileName(`faldon_9x16_${sanitizedTitle}_${suffix}.${format}`);
        resolve();
      };

      mediaRecorder.onerror = (e) => reject(e);

      mediaRecorder.start(100);

      const fps = 60;
      const frameIntervalMs = 1000 / fps; // 16.666ms per frame
      const totalDurationSeconds = 7.0;
      const totalFrameCount = totalDurationSeconds * fps; // 420
      const drawBackground = includeBg || format === 'mp4';
      const bgFill = includeBg
        ? selectedBg.type === 'color' || selectedBg.type === 'gradient'
          ? selectedBg.url
          : '#0f172a'
        : '#000000';

      let frame = 0;
      const startTime = performance.now();

      const processFrame = async () => {
        if (frame >= totalFrameCount) {
          setTimeout(() => {
            if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
          }, 300);
          return;
        }

        const t = (frame / totalFrameCount) * totalDurationSeconds;
        setCurrentFrame(frame + 1);
        setProgress(Math.round(((frame + 1) / totalFrameCount) * 100));

        await renderLowerThirdFrameToCanvas(
          ctx,
          1080,
          1920,
          t,
          config,
          logoImg,
          bgElement,
          drawBackground,
          bgFill
        );

        frame++;

        // Calculate real time delay to keep clock perfectly at 7 seconds
        const targetTime = startTime + frame * frameIntervalMs;
        const delay = Math.max(0, targetTime - performance.now());
        setTimeout(processFrame, delay);
      };

      processFrame();
    });
  };

  // Main Export Video Controller
  const handleExportVideo = async (format: 'mp4' | 'webm', includeBg: boolean) => {
    if (!hiddenCanvasRef.current) return;
    setIsRendering(true);
    setErrorMessage(null);
    setProgress(0);
    setCurrentFrame(0);
    setDownloadUrl(null);

    try {
      const logoImg = await loadLogoImage();
      let bgElement: HTMLImageElement | null = null;
      if (includeBg && customBgUrl && customBgType === 'image') {
        bgElement = await loadImage(customBgUrl);
      }

      // Check if WebCodecs VideoEncoder is available for native fast MP4 export
      const supportsWebCodecs =
        typeof window !== 'undefined' &&
        typeof (window as any).VideoEncoder !== 'undefined' &&
        typeof (window as any).VideoFrame !== 'undefined';

      if (supportsWebCodecs) {
        if (format === 'mp4') {
          console.log('Exportando MP4 nativo con WebCodecs + mp4-muxer...');
          await exportMp4WithWebCodecs(includeBg, logoImg, bgElement);
        } else {
          console.log('Exportando WebM nativo con WebCodecs + webm-muxer...');
          await exportWebmWithWebCodecs(includeBg, logoImg, bgElement);
        }
      } else {
        console.log('Exportando vídeo con MediaRecorder...');
        await exportVideoWithMediaRecorder(format, includeBg, logoImg, bgElement);
      }
    } catch (err: any) {
      console.error('Error durante la exportación de vídeo:', err);
      // Fallback try with MediaRecorder if WebCodecs failed
      try {
        const logoImg = await loadLogoImage();
        let bgElement: HTMLImageElement | null = null;
        if (includeBg && customBgUrl && customBgType === 'image') {
          bgElement = await loadImage(customBgUrl);
        }
        await exportVideoWithMediaRecorder(format, includeBg, logoImg, bgElement);
      } catch (fallbackErr: any) {
        console.error('Fallback export error:', fallbackErr);
        setErrorMessage(
          'No se pudo procesar el vídeo en tu navegador. Puedes intentar exportar la captura estática en PNG.'
        );
      }
    } finally {
      setIsRendering(false);
    }
  };

  const startExport = () => {
    if (exportType === 'mp4-bg') {
      handleExportVideo('mp4', true);
    } else if (exportType === 'mp4-transparent') {
      handleExportVideo('mp4', false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Hidden high-res canvas (positioned offscreen so captureStream & WebCodecs render frames reliably) */}
      <canvas
        ref={hiddenCanvasRef}
        width={1080}
        height={1920}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '1080px',
          height: '1920px',
          pointerEvents: 'none',
          opacity: 0.01,
          zIndex: -1,
        }}
      />

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Exportar Rótulo Faldón 9:16
              </h3>
              <p className="text-xs text-slate-400">
                Calidad Ultra HD 1080 × 1920 px (60 FPS)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isRendering}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Error en el renderizado</p>
                <p className="mt-1 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {!isRendering && !downloadUrl && (
            <>
              <p className="text-xs text-slate-300 leading-relaxed">
                Selecciona el formato de exportación preferido para tu editor de vídeo (Premiere, CapCut, DaVinci Resolve, Instagram, TikTok, etc.):
              </p>

              <div className="space-y-3">
                {/* Option 1: MP4 with background */}
                <button
                  onClick={() => setExportType('mp4-bg')}
                  className={`w-full p-4 rounded-xl border text-left transition flex items-start gap-3 ${
                    exportType === 'mp4-bg'
                      ? 'border-teal-500 bg-teal-500/10 text-white ring-1 ring-teal-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Video className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                      <span>Vídeo MP4 (.mp4) con Fondo Integrado / Sólido</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 font-mono font-bold">
                        Recomendado MP4
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Genera un vídeo MP4 de 7s (1080x1920 60 FPS H.264) compatible con CapCut, móvil, Instagram Reels y TikTok.
                    </p>
                  </div>
                </button>

                {/* Option 2: MP4 Overlay / Black base */}
                <button
                  onClick={() => setExportType('mp4-transparent')}
                  className={`w-full p-4 rounded-xl border text-left transition flex items-start gap-3 ${
                    exportType === 'mp4-transparent'
                      ? 'border-teal-500 bg-teal-500/10 text-white ring-1 ring-teal-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Film className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                      <span>Vídeo MP4 (.mp4) sobre Fondo Negro</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                        MP4 H.264
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Exporta el vídeo en MP4 limpio con fondo negro para combinar fácilmente en cualquier editor de vídeo.
                    </p>
                  </div>
                </button>
              </div>

              <button
                onClick={startExport}
                className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Iniciar Procesamiento de Rótulo</span>
              </button>
            </>
          )}

          {/* Rendering Progress */}
          {isRendering && (
            <div className="py-8 space-y-4 text-center">
              <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-slate-200 text-sm">
                  Procesando Fotogramas a 60 FPS...
                </h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Fotograma {currentFrame} de {totalFrames} ({progress}%)
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Download Complete Ready */}
          {!isRendering && downloadUrl && (
            <div className="py-6 space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-base">
                  ¡Rótulo Renderizado con Éxito!
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Tu archivo está listo para descargar e importar en tu editor de vídeo.
                </p>
              </div>

              <a
                href={downloadUrl}
                download={downloadFileName}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 transition flex items-center justify-center gap-2 text-center font-bold"
              >
                <Download className="w-4 h-4 inline" />
                <span>Descargar {downloadFileName}</span>
              </a>

              <button
                onClick={() => setDownloadUrl(null)}
                className="text-xs text-slate-400 hover:text-slate-200 block mx-auto pt-2"
              >
                Elegir otro formato
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

