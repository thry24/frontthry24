import { Component, OnInit } from '@angular/core';
import { WishlistService } from 'src/app/services/wishlist.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false
})
export class FavoritosPage implements OnInit {
  propiedades: any[] = [];

  constructor(
    private wishlist: WishlistService,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    this.obtenerFavoritos();
  }

  obtenerFavoritos() {
    this.loading.mostrar();
    this.wishlist.obtenerFavoritos().subscribe({
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

  toggleFavorito(id: string): void {
    this.loading.mostrar();
    this.wishlist.eliminarDeFavoritos(id).subscribe(() => {
      setTimeout(() => {
        this.propiedades = this.propiedades.filter(p => p._id !== id);
        this.loading.ocultar();
      }, 1000);
    });
  }

  verMas() {
  }
}
