import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { RecommendationService } from 'src/app/services/recomendaciones.service';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.page.html',
  styleUrls: ['./recomendaciones.page.scss'],
  standalone: false
})
export class RecomendacionesPage implements OnInit {
 propiedades: any[] = [];

  constructor(
    private recomendacion: RecommendationService,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    this.obtenerFavoritos();
  }

  obtenerFavoritos() {
    this.loading.mostrar();
    this.recomendacion.obtenerRecomendaciones().subscribe({
      next: (res: any) => {
        console.log('Favoritos:', res);
        this.propiedades = Array.isArray(res) ? res : [];
        this.loading.ocultar();
      },
      error: (err) => {
        console.error('Error al obtener favoritos:', err);
        this.loading.ocultar();
      }
    });
  }

  esFavorito(id: string): boolean {
    return true;
  }

  toggleFavorito(event: Event, id: string): void {
    event.stopPropagation();
    this.loading.mostrar();
    this.recomendacion.rechazarRecomendacion(id).subscribe(() => {
      setTimeout(() => {
        this.propiedades = this.propiedades.filter(p => p._id !== id);
        this.loading.ocultar();
      }, 1000);
    });
  }
}
