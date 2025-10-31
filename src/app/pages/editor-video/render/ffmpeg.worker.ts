/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// 🧠 Instancia global
const ffmpeg = new FFmpeg();

// 📁 Rutas absolutas del core wasm
function corePaths() {
  const base = (self as any).location?.origin || '';
  const root = `${base}/assets/ffmpeg-core`;
  return {
    coreURL: `${root}/ffmpeg-core.js`,
    wasmURL: `${root}/ffmpeg-core.wasm`,
    workerURL: `${root}/ffmpeg-core.worker.js`,
  };
}

// 🧩 Conversión segura (evita SharedArrayBuffer)
function toSafeArrayBuffer(input: Uint8Array | ArrayBufferLike): ArrayBuffer {
  if (input instanceof Uint8Array) return input.slice().buffer;
  return new Uint8Array(input).slice().buffer;
}

addEventListener('message', async (e) => {
  const { jobId, images, overlaysPngPerClip, template, fps } = e.data as {
    jobId: string;
    images: File[];
    overlaysPngPerClip: Blob[];
    template: {
      aspect: '9:16' | '16:9' | '1:1';
      perImageDuration: number;
      transitions?: { duration?: number };
    };
    fps: number;
  };

  try {
    // 🧱 Carga FFmpeg una sola vez
    if (!ffmpeg.loaded) {
      await ffmpeg.load(corePaths());
      ffmpeg.on('log', ({ message }) => console.log('[ffmpeg]', message));
    }

    const W =
      template.aspect === '9:16'
        ? 720
        : template.aspect === '16:9'
        ? 1280
        : 1080;
    const H =
      template.aspect === '9:16'
        ? 1280
        : template.aspect === '16:9'
        ? 720
        : 1080;
    const dur = template.perImageDuration;
    const tDur = Math.max(0.4, template.transitions?.duration ?? 0.6);

    // 🎞️ 1) Crear clips individuales
    for (let i = 0; i < images.length; i++) {
      const imgName = `img_${i}.png`;
      const ovName = `ov_${i}.png`;
      const clipName = `clip_${i}.mp4`;

      await ffmpeg.writeFile(imgName, await fetchFile(images[i]));
      await ffmpeg.writeFile(ovName, await fetchFile(overlaysPngPerClip[i]));

      await ffmpeg.exec([
        '-loop',
        '1',
        '-t',
        String(dur),
        '-i',
        imgName,
        '-i',
        ovName,
        '-filter_complex',
        `[0:v]scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:black[bg];[bg][1:v]overlay=0:0:format=auto`,
        '-r',
        String(fps),
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        clipName,
      ]);

      postMessage({
        jobId,
        progress: Math.round(((i + 1) / images.length) * 50),
      });
    }

    // 🎬 2) Concatenar con transiciones (xfade)
    const inputArgs: string[] = [];
    for (let i = 0; i < images.length; i++)
      inputArgs.push('-i', `clip_${i}.mp4`);

    let filters: string[] = [];
    let last = '0:v';
    let outLabel = images.length === 1 ? '0:v' : '';
    for (let i = 1; i < images.length; i++) {
      const cur = `${i}:v`;
      const lbl = `xf_${i}`;
      filters.push(
        `[${last}][${cur}]xfade=transition=fade:duration=${tDur}:offset=${
          dur - tDur
        }[${lbl}]`
      );
      last = lbl;
      outLabel = lbl;
    }

    await ffmpeg.exec([
      ...inputArgs,
      '-filter_complex',
      filters.length ? filters.join(';') : 'null',
      '-map',
      `[${outLabel}]`,
      '-r',
      String(fps),
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      'output.mp4',
    ]);
// 🧩 Lee el archivo final con tipado explícito y seguro
const rawData = (await ffmpeg.readFile('output.mp4')) as unknown;

// 🔒 Normaliza el tipo devuelto (algunas builds devuelven string)
const data =
  typeof rawData === 'string'
    ? new TextEncoder().encode(rawData)
    : (rawData as Uint8Array);

// ✅ Conversión segura a ArrayBuffer plano
const safeBuffer = data.slice().buffer;

// 💾 Crea el blob y la URL final
const blob = new Blob([safeBuffer], { type: 'video/mp4' });
const url = URL.createObjectURL(blob);

postMessage({ jobId, done: true, url });


    postMessage({ jobId, done: true, url });
  } catch (err) {
    console.error('❌ Worker FFmpeg error:', err);
    postMessage({ jobId, error: String(err) });
  }
});
