import { TemplateGraphic } from '../models/template';

export async function renderOverlayPNG(
  tpl: TemplateGraphic,
  bindings: Record<string, string>
): Promise<Blob> {
  const W = tpl.aspect === '9:16' ? 720 : tpl.aspect === '16:9' ? 1280 : 1080;
  const H = tpl.aspect === '9:16' ? 1280 : tpl.aspect === '16:9' ? 720 : 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Overlays
  tpl.overlays.forEach(o => {
    ctx.globalAlpha = o.opacity ?? 1;
    ctx.fillStyle = o.fill;
    if (o.kind === 'roundRect') {
      const r = o.radius ?? 0;
      ctx.beginPath();
      ctx.moveTo(o.x + r, o.y);
      ctx.arcTo(o.x + o.width, o.y, o.x + o.width, o.y + o.height, r);
      ctx.arcTo(o.x + o.width, o.y + o.height, o.x, o.y + o.height, r);
      ctx.arcTo(o.x, o.y + o.height, o.x, o.y, r);
      ctx.arcTo(o.x, o.y, o.x + o.width, o.y, r);
      ctx.closePath();
      ctx.fill();
    } else ctx.fillRect(o.x, o.y, o.width, o.height);
  });

  // Texts
  tpl.textBoxes.forEach(tb => {
    const text = tb.binding ? (bindings[tb.binding] ?? tb.text ?? '') : (tb.text ?? '');
    if (!text) return;
    ctx.font = `${tb.font.weight ?? 700} ${tb.font.size}px ${tb.font.family}`;
    ctx.fillStyle = tb.font.color;
    ctx.textAlign = tb.align ?? 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, tb.x, tb.y);
  });

  return await new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/png'));
}
