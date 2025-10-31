import { TemplateGraphic } from '../models/template';

export const TPL_LOCAL_GOLD: TemplateGraphic = {
  id: 'local_gold_v1',
  label: 'Local — Gold Banner',
  kind: 'local',
  aspect: '9:16',
  fps: 30,
  perImageDuration: 3,
  palette: [
    { name: 'primary', value: '#FFD700' },
    { name: 'text', value: '#FFFFFF' },
    { name: 'panel', value: '#000000B3' },
  ],
  defaultFont: { id: 'Inter', name: 'Inter' },
  overlays: [
    { id: 'bottomStrip', kind: 'rect', x: 0, y: 1150, width: 720, height: 130, fill: '#000000B3' },
  ],
  textBoxes: [
    {
      id: 'title', binding: 'title', x: 60, y: 1160,
      font: { family: 'Inter', weight: 800, size: 40, color: '#FFD700' },
    },
    {
      id: 'tagline', binding: 'tagline', x: 60, y: 1210,
      font: { family: 'Inter', weight: 400, size: 28, color: '#FFFFFF' },
    },
  ],
  transitions: { in: 'zoomIn', out: 'fade', duration: 0.6 },
  allowCustomFonts: true,
};

export const TPL_DEPA_MODERN: TemplateGraphic = {
  id: 'depa_moderno_v1',
  label: 'Departamento — Modern Blocks',
  kind: 'departamento',
  aspect: '9:16',
  fps: 30,
  perImageDuration: 3,
  palette: [
    { name: 'primary', value: '#0EA5E9' },
    { name: 'text', value: '#0B1020' },
    { name: 'panel', value: '#FFFFFFE6' },
  ],
  defaultFont: { id: 'Poppins', name: 'Poppins' },
  overlays: [
    { id: 'corner', kind: 'roundRect', x: 24, y: 980, width: 672, height: 220, radius: 28, fill: '#FFFFFFE6' },
  ],
  textBoxes: [
    {
      id: 'title', binding: 'title', x: 60, y: 1000,
      font: { family: 'Poppins', weight: 700, size: 34, color: '#0B1020' },
    },
    {
      id: 'tagline', binding: 'tagline', x: 60, y: 1050,
      font: { family: 'Poppins', weight: 400, size: 24, color: '#0B1020' },
    },
  ],
  transitions: { in: 'smoothLeft', out: 'fade', duration: 0.5 },
  allowCustomFonts: true,
};
