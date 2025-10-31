import { TemplateGraphic, TransitionName } from '../models/template';

export interface EditorState {
  template: TemplateGraphic;
  images: File[];
  bindings: { title?: string; tagline?: string };
  perClipTransition?: Record<number, { name: TransitionName; duration?: number }>;
}
