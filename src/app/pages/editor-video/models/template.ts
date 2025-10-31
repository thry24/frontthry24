export type Aspect = '9:16' | '16:9' | '1:1';
export type TransitionName = 'fade' | 'slideLeft' | 'smoothLeft' | 'zoomIn';

export interface FontRef { id: string; name: string; url?: string; }
export interface TextBox {
  id: string;
  binding?: 'title' | 'tagline';
  text?: string;
  x: number; y: number; width?: number;
  align?: 'left' | 'center' | 'right';
  font: { family: string; weight?: number; size: number; color: string; boxBg?: string; padding?: number; };
}
export interface ShapeOverlay {
  id: string; kind: 'rect' | 'roundRect';
  x: number; y: number; width: number; height: number; radius?: number; fill: string; opacity?: number;
}

export interface TemplateGraphic {
  id: string; label: string; kind: string;
  aspect: Aspect; fps: number; perImageDuration: number;
  palette: { name: string; value: string }[];
  defaultFont: FontRef;
  overlays: ShapeOverlay[];
  textBoxes: TextBox[];
  transitions: { in: TransitionName; out: TransitionName; duration: number };
  allowCustomFonts: boolean;
}
