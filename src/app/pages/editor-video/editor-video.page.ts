import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TEMPLATES, TemplateGraphic } from './templates';

type TransitionName = 'fade' | 'slideLeft' | 'zoomIn' | 'zoomOut' | 'panUp' | 'panRight' | 'dronForward';


@Component({
  selector: 'app-editor-video',
  standalone: true,
  templateUrl: './editor-video.page.html',
  styleUrls: ['./editor-video.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class EditorVideoPage {
  @ViewChild('stageCanvas', { static: true }) stageRef!: ElementRef<HTMLCanvasElement>;
  Math = Math;

  // Estado UI
  templates: TemplateGraphic[] = TEMPLATES;
  plantillaId = 'local_gold_v1';
  bindings = {
  title: '', 
  tagline: '', 
  telefono: '', 
  sitio: '', 
  direccion: '', 
  cta: '',
  intro: '',
  mensaje: ''
  };
  fonts = ['Inter', 'Poppins', 'Montserrat', 'Roboto', 'Oswald', 'Lato', 'Playfair Display', 'DM Sans', 'Source Sans 3', 'Arial', 'Georgia'];
  fontFamily = 'Inter';
  fontColor = '#ffffff';
  transitionName: TransitionName = 'fade';
  perImageSec = 3;

  // Imágenes
  images: File[] = [];
  bitmaps: ImageBitmap[] = [];
  imagePreviews: string[] = [];

  // Render / salida
  canvasW = 720; canvasH = 1280;
  fps = 30;
  videoUrl: string | null = null;
  cargando = false;
  progreso = 0;
  errorMsg = '';

  ngAfterViewInit() {
    this.applyAspectFromTemplate();
    this.loadGoogleFontIfNeeded();
    this.paintPreview(); // lienzo vacío
  }

  // ---------- Entrada de archivos ----------
  onImagenesSeleccionadas(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.images = Array.from(input.files);
    this.imagePreviews = this.images.map(f => URL.createObjectURL(f));
    // precargar bitmaps
    this.loadBitmaps();
  }

  private async loadBitmaps() {
    // Libera anteriores
    for (const bm of this.bitmaps) bm.close?.();
    this.bitmaps = [];

    for (const file of this.images) {
      const bmp = await createImageBitmap(file);
      this.bitmaps.push(bmp);
    }
    this.paintPreview();
  }

  // ---------- Fuentes ----------
  loadGoogleFontIfNeeded() {
    const googleSet = new Set(['Inter','Poppins','Montserrat','Roboto','Oswald','Lato','Playfair Display','DM Sans','Source Sans 3']);
    if (!googleSet.has(this.fontFamily)) return;
    const id = `gfont-${this.fontFamily.replace(/\s+/g,'+')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(this.fontFamily)}:wght@200;400;600;700;800&display=swap`;
    document.head.appendChild(link);
  }

  // ---------- Plantillas ----------
  private get currentTemplate(): TemplateGraphic {
    return this.templates.find(t => t.id === this.plantillaId)!;
  }

  private applyAspectFromTemplate() {
    const asp = this.currentTemplate.aspect;
    if (asp === '9:16')      { this.canvasW = 720;  this.canvasH = 1280; }
    else if (asp === '16:9') { this.canvasW = 1280; this.canvasH = 720;  }
    else                     { this.canvasW = 1080; this.canvasH = 1080; }
  }

  // ---------- Dibujo estático (preview) ----------
private drawFrame(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  t: TemplateGraphic,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
  stage: number = 0 // 👈 nueva variable de etapa
) {
  const W = this.canvasW, H = this.canvasH;

  // fondo
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  // imagen
  const iw = (img as any).width, ih = (img as any).height;
  const s = Math.max(W / iw, H / ih) * scale;
  const dw = iw * s, dh = ih * s;
  const dx = (W - dw) / 2 + offsetX;
  const dy = (H - dh) / 2 + offsetY;
  ctx.drawImage(img, dx, dy, dw, dh);

  // overlays
  for (const ov of t.overlays) {
    ctx.save();
    ctx.globalAlpha = ov.alpha ?? 1;
    ctx.fillStyle = ov.color;
    if (ov.kind === 'roundRect') {
      const r = ov.r ?? 0;
      ctx.beginPath();
      ctx.moveTo(ov.x + r, ov.y);
      ctx.arcTo(ov.x + ov.w, ov.y, ov.x + ov.w, ov.y + ov.h, r);
      ctx.arcTo(ov.x + ov.w, ov.y + ov.h, ov.x, ov.y + ov.h, r);
      ctx.arcTo(ov.x, ov.y + ov.h, ov.x, ov.y, r);
      ctx.arcTo(ov.x, ov.y, ov.x + ov.w, ov.y, r);
      ctx.closePath();
      ctx.fill();
    } else ctx.fillRect(ov.x, ov.y, ov.w, ov.h);
    ctx.restore();
  }

  // 🎬 controla qué textos se muestran según etapa
  const visibles: string[] =
    stage === 0 ? ['title', 'tagline'] :
    stage === 1 ? ['intro', 'mensaje'] :
    ['cta', 'telefono', 'sitio', 'direccion'];

  // textos
  for (const tb of t.textBoxes) {
    if (!visibles.includes(tb.binding)) continue;
    const text = this.bindings[tb.binding] || '';
    if (!text) continue;

    ctx.fillStyle = tb.color || this.fontColor;
    ctx.font = `${tb.weight ?? 700} ${tb.size}px "${this.fontFamily}", sans-serif`;
    ctx.textAlign = tb.align || 'center';
    ctx.textBaseline = 'top';
    this.wrapText(ctx, text, tb.x, tb.y, W - 100, tb.size * 1.3);
  }
}
private wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

  /** Divide el texto en líneas que quepan en maxWidth */
  private wrapLines(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    const words = (text || '').split(/\s+/);
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  /** Dibuja líneas centradas horizontalmente y centradas verticalmente en un box. Hace ellipsis si se excede. */
  private drawMultilineCenteredInBox(
    ctx: CanvasRenderingContext2D,
    lines: string[],
    centerX: number,
    boxY: number,
    boxH: number,
    lineHeight: number,
    maxLines: number
  ) {
    // corta con ellipsis si hay demasiadas líneas
    let out = lines.slice(0, maxLines);
    if (lines.length > maxLines) {
      const last = out[out.length - 1] || '';
      out[out.length - 1] = last.replace(/\.{0,3}$/, '…');
    }
    const totalH = out.length * lineHeight;
    let y = boxY + (boxH - totalH) / 2;
    for (const ln of out) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(ln, centerX, y);
      y += lineHeight;
    }
  }

  private paintPreview() {
    const canvas = this.stageRef?.nativeElement; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0,0,this.canvasW,this.canvasH);

    const tpl = this.currentTemplate;
    const img = this.bitmaps[0];
    if (img) this.drawFrame(ctx, img, tpl);
    else { ctx.fillStyle = '#111'; ctx.fillRect(0,0,this.canvasW,this.canvasH); }
  }

  // ---------- Render a video (MediaRecorder) ----------
  async generarVideo() {
    try {
      this.errorMsg = '';
      if (!this.bitmaps.length) { this.errorMsg = 'Selecciona imágenes.'; return; }
      this.applyAspectFromTemplate();
      this.cargando = true; this.progreso = 0; this.videoUrl = null;

      const canvas = this.stageRef.nativeElement;
      const ctx = canvas.getContext('2d')!;
      const stream = (canvas as any).captureStream(this.fps);
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      const done = new Promise<void>(res => recorder.onstop = () => res());

      recorder.start();

      const tpl = this.currentTemplate;
      const frameDur = 1000 / this.fps;
      const stillMs = Math.max(0.5, this.perImageSec) * 1000; // duración por imagen
      const trMs = 600; // transición 0.6s
      const totalFramesPerStill = Math.round(stillMs / frameDur);
      const totalFramesPerTr = Math.round(trMs / frameDur);

      const W = this.canvasW, H = this.canvasH;

// recorre imágenes y renderiza
for (let i = 0; i < this.bitmaps.length; i++) {
  let stage = 0;
  let nextStage = 0;

  // 🧠 Solo aplicar la lógica de "etapas" si es la plantilla HOGAR IDEAL
  if (tpl.id === 'hogar_ideal_v1') {
    const progress = i / (this.bitmaps.length - 1);
    if (progress < 0.33) stage = 0;
    else if (progress < 0.66) stage = 1;
    else stage = 2;

    const nextProgress = (i + 1) / (this.bitmaps.length - 1);
    if (nextProgress < 0.33) nextStage = 0;
    else if (nextProgress < 0.66) nextStage = 1;
    else nextStage = 2;
  }

  // 🔹 Primer ciclo de imagen fija
  for (let f = 0; f < totalFramesPerStill; f++) {
    ctx.clearRect(0, 0, W, H);
    this.drawFrame(ctx, this.bitmaps[i], tpl, 1, 0, 0, stage);
    await this.sleep(frameDur);
  }

  // 🔹 Transición si existe siguiente imagen
  const next = this.bitmaps[i + 1];
  if (!next) break;

  for (let f = 0; f < totalFramesPerTr; f++) {
    const t = f / totalFramesPerTr;
    ctx.clearRect(0, 0, W, H);

    if (this.transitionName === 'fade') {
      this.drawFrame(ctx, this.bitmaps[i], tpl, 1, 0, 0, stage);
      ctx.save(); ctx.globalAlpha = t;
      this.drawFrame(ctx, next, tpl, 1, 0, 0, nextStage);
      ctx.restore();
    } else if (this.transitionName === 'slideLeft') {
      const off = -W * t;
      this.drawFrame(ctx, this.bitmaps[i], tpl, 1, off, 0, stage);
      this.drawFrame(ctx, next, tpl, 1, off + W, 0, nextStage);
    } else if (this.transitionName === 'zoomIn') {
      const scale = 1 + 0.05 * t;
      this.drawFrame(ctx, this.bitmaps[i], tpl, scale, 0, 0, stage);
      ctx.save(); ctx.globalAlpha = Math.max(0, t - 0.5) * 2;
      this.drawFrame(ctx, next, tpl, 1, 0, 0, nextStage);
      ctx.restore();
    } else if (this.transitionName === 'zoomOut') {
      const scale = 1.1 - 0.1 * t;
      this.drawFrame(ctx, this.bitmaps[i], tpl, scale, 0, 0, stage);
      ctx.save(); ctx.globalAlpha = t;
      this.drawFrame(ctx, next, tpl, 1, 0, 0, nextStage);
      ctx.restore();
    } else if (this.transitionName === 'panUp') {
      const off = -H * t * 0.3;
      this.drawFrame(ctx, this.bitmaps[i], tpl, 1, 0, off, stage);
      ctx.save(); ctx.globalAlpha = t;
      this.drawFrame(ctx, next, tpl, 1, 0, off + H * 0.3, nextStage);
      ctx.restore();
    } else if (this.transitionName === 'panRight') {
      const off = W * t * 0.3;
      this.drawFrame(ctx, this.bitmaps[i], tpl, 1, off, 0, stage);
      ctx.save(); ctx.globalAlpha = t;
      this.drawFrame(ctx, next, tpl, 1, off - W * 0.3, 0, nextStage);
      ctx.restore();
    } else if (this.transitionName === 'dronForward') {
      const scale = 1 + 0.15 * t;
      const tilt = -H * 0.1 * t;
      this.drawFrame(ctx, this.bitmaps[i], tpl, scale, 0, tilt, stage);
      ctx.save(); ctx.globalAlpha = Math.max(0, t - 0.4) * 1.8;
      this.drawFrame(ctx, next, tpl, 1, 0, 0, nextStage);
      ctx.restore();
    }

    await this.sleep(frameDur);
  }

  this.progreso = (i + 1) / this.bitmaps.length;
}

      recorder.stop();
      await done;

      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      this.videoUrl = url;
      this.cargando = false; this.progreso = 1;
    } catch (err:any) {
      this.cargando = false;
      this.errorMsg = 'Error al renderizar: ' + (err?.message || err);
      console.error(err);
    }
  }

  descargarVideo() {
    if (!this.videoUrl) return;
    const a = document.createElement('a');
    a.href = this.videoUrl;
    a.download = 'video_propiedad.webm';
    a.click();
  }

  private sleep(ms:number){ return new Promise(r=>setTimeout(r, ms)); }
}
