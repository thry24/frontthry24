export type Aspect = '9:16' | '16:9' | '1:1';

export interface TextBox {
  id: string;
  x: number;
  y: number;
  align?: 'left' | 'center' | 'right';
  size: number;
  weight?: number;
  color?: string;
}


export interface TemplateGraphic {
  id: string;
  label: string;
  aspect: Aspect;
  overlays: Array<{
    kind: 'rect' | 'roundRect';
    x: number;
    y: number;
    w: number;
    h: number;
    r?: number;
    color: string;
    alpha?: number;
  }>;
  textBoxes: Array<TextBox & { binding: 'title' | 'tagline' | 'telefono' | 'sitio' | 'direccion' | 'cta' | 'intro' | 'mensaje'}>;

}


/* 🎨 Paleta */
const AZUL = '#0C2340';
const NARANJA = '#F47A20';
const BLANCO = '#FFFFFF';
const DORADO = '#FFD700';
const NEGRO = '#000000';

/* 🧩 Plantillas AI24 */
export const TEMPLATES: TemplateGraphic[] = [
  // 1️⃣ Local — Gold Banner (ya existente)
  {
    id: 'local_gold_v1',
    label: 'Local — Gold Banner',
    aspect: '9:16',
    overlays: [
      { kind: 'rect', x: 0, y: 1100, w: 720, h: 180, color: NEGRO, alpha: 0.6 },
    ],
    textBoxes: [
      { id: 'title', binding: 'title', x: 40, y: 1120, align: 'left', size: 44, weight: 800, color: DORADO },
      { id: 'tagline', binding: 'tagline', x: 40, y: 1180, align: 'left', size: 28, weight: 400, color: BLANCO },
    ],
  },

  // 2️⃣ Departamento — Modern Blocks (ya existente)
  {
    id: 'depa_moderno_v1',
    label: 'Departamento — Modern Blocks',
    aspect: '9:16',
    overlays: [
      { kind: 'roundRect', x: 24, y: 980, w: 672, h: 220, r: 24, color: BLANCO, alpha: 0.92 },
    ],
    textBoxes: [
      { id: 'title', binding: 'title', x: 48, y: 1000, align: 'left', size: 36, weight: 800, color: AZUL },
      { id: 'tagline', binding: 'tagline', x: 48, y: 1050, align: 'left', size: 22, weight: 500, color: AZUL },
    ],
  },

  // 3️⃣ Vive donde siempre soñaste
  {
    id: 'vive_siempre_v1',
    label: 'Vive donde siempre soñaste',
    aspect: '9:16',
    overlays: [
      { kind: 'rect', x: 0, y: 0, w: 720, h: 350, color: AZUL, alpha: 0.75 },
      { kind: 'rect', x: 0, y: 1060, w: 720, h: 220, color: BLANCO, alpha: 0.95 },
    ],
    textBoxes: [
      { id: 'title', binding: 'title', x: 60, y: 80, align: 'left', size: 52, weight: 800, color: BLANCO },
      { id: 'tagline', binding: 'tagline', x: 60, y: 1130, align: 'left', size: 28, weight: 500, color: AZUL },
    ],
  },

    {
    id: 'oferta_especial_v1',
    label: 'Oferta Especial',
    aspect: '9:16',
    overlays: [
        { kind: 'rect', x: 0, y: 0, w: 720, h: 1280, color: '#0B1020', alpha: 0.45 }, // fondo azulado
        { kind: 'roundRect', x: 80, y: 960, w: 560, h: 220, r: 16, color: '#E87A2C', alpha: 0.96 } // cuadro naranja
    ],
    textBoxes: [
        // Las posiciones no importan; las gestionaremos dentro del cuadro
        { id:'title',   binding:'title',   x: 360, y: 990, align:'center', size: 44, weight: 800, color: '#FFFFFF' },
        { id:'tagline', binding:'tagline', x: 360, y:1045, align:'center', size: 26, weight: 500, color: '#FFFFFF' }
    ]
    },



  // 5️⃣ Ficha Técnica
  {
    id: 'ficha_tecnica_v1',
    label: 'Ficha Técnica',
    aspect: '9:16',
    overlays: [
      { kind: 'rect', x: 0, y: 0, w: 720, h: 160, color: AZUL, alpha: 1 },
      { kind: 'rect', x: 0, y: 1100, w: 720, h: 180, color: AZUL, alpha: 1 },
    ],
    textBoxes: [
      { id: 'title', binding: 'title', x: 50, y: 60, align: 'left', size: 42, weight: 700, color: BLANCO },
      { id: 'tagline', binding: 'tagline', x: 50, y: 1160, align: 'left', size: 28, weight: 500, color: BLANCO },
    ],
  },
// 7️⃣ Tu Hogar Ideal — Contacto
{
  id: 'hogar_ideal_v1',
  label: 'Hogar Ideal — Secuencial',
  aspect: '9:16',
  overlays: [
    { kind: 'rect', x: 0, y: 0, w: 720, h: 1280, color: '#0C2340', alpha: 0.45 },
  ],
  textBoxes: [
    // 🏡 Sección 1: título y descripción
    { id: 'title', binding: 'title', x: 360, y: 120, align: 'center', size: 56, weight: 800, color: '#FFD700' },
    { id: 'tagline', binding: 'tagline', x: 360, y: 190, align: 'center', size: 30, weight: 500, color: '#FFFFFF' },

    // 💬 Sección 2: mensaje motivador
    { id: 'intro', binding: 'intro', x: 360, y: 500, align: 'center', size: 48, weight: 700, color: '#FFD700' },
    { id: 'mensaje', binding: 'mensaje', x: 360, y: 570, align: 'center', size: 28, weight: 500, color: '#FFFFFF' },

    // 📞 Sección 3: contacto
    { id: 'cta', binding: 'cta', x: 360, y: 920, align: 'center', size: 34, weight: 800, color: '#FFD700' },
    { id: 'telefono', binding: 'telefono', x: 360, y: 980, align: 'center', size: 26, weight: 500, color: '#FFFFFF' },
    { id: 'sitio', binding: 'sitio', x: 360, y: 1015, align: 'center', size: 26, weight: 500, color: '#FFFFFF' },
    { id: 'direccion', binding: 'direccion', x: 360, y: 1050, align: 'center', size: 24, weight: 400, color: '#FFFFFF' },
  ],
}


];
