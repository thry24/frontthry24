import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-editor-video',
  standalone: true,
  templateUrl: './editor-video.page.html',
  styleUrls: ['./editor-video.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class EditorVideoPage {
  textoPersonalizado = '';
  imagenes: File[] = [];
  videoPreview: string | null = null;

  plantillas = [
    {
      nombre: 'Tour Moderno',
      carpeta: 'tour-moderno',
      preview: 'assets/plantillas/tour-moderno/fondo.jpg',
    },
    {
      nombre: 'Estilo Minimal',
      carpeta: 'estilo-minimal',
      preview: 'assets/plantillas/estilo-minimal/fondo.jpg',
    },
  ];
  plantillaSeleccionada: any = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  seleccionarPlantilla(plantilla: any) {
    this.plantillaSeleccionada = plantilla;
  }

  onImagenesSeleccionadas(event: any) {
    this.imagenes = Array.from(event.target.files);
  }


async generarVideoReal() {
  if (!this.plantillaSeleccionada || this.imagenes.length === 0 || !this.textoPersonalizado) {
    alert("Por favor selecciona plantilla, imágenes y escribe un texto.");
    return;
  }

  const formData = new FormData();
  formData.append('texto', this.textoPersonalizado);
  formData.append('plantilla', this.plantillaSeleccionada.carpeta);

  this.imagenes.forEach((img, idx) => {
    formData.append('imagenes', img);
  });

  try {
    const response: any = await this.http.post('http://localhost:5000/api/video/generar', formData).toPromise();
    this.videoPreview = response.videoUrl;
  } catch (error) {
    console.error('Error generando video:', error);
    alert('Ocurrió un error al generar el video.');
  }
}


  async cargarImagen(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => resolve(img);
      };
      reader.readAsDataURL(file);
    });
  }

  async cargarImagenUrl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => resolve(img);
    });
  }

  descargarVideo() {
    if (!this.videoPreview) return;
    const a = document.createElement('a');
    a.href = this.videoPreview;
    a.download = 'promocion-ai24.webp';
    a.click();
  }

  compartir(red: string) {
    const mensaje = `¡Mira esta propiedad! 📍 #AI24`;
    const url = this.videoPreview;

    if (navigator.share && url) {
      navigator.share({
        title: 'Promoción AI24',
        text: mensaje,
        url,
      });
    } else {
      alert(`Puedes compartir este contenido en ${red.toUpperCase()} manualmente.`);
    }
  }
}
