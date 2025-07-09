import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  propiedades: any[] = [];
  propiedadesFiltradas: any[] = [];
  tipoSeleccionado: string = 'casa';

  tipos = [
    { clave: 'casa', label: 'Casas' },
    { clave: 'departamento', label: 'Departamentos' },
    { clave: 'terreno', label: 'Terrenos' },
    { clave: 'local', label: 'Locales' },
    { clave: 'bodega', label: 'Bodegas' },
    { clave: 'oficina', label: 'Oficinas' },
    { clave: 'edificio', label: 'Edificios' },
    { clave: 'rancho', label: 'Ranchos' },
  ];

  favoritos: string[] = [];

  constructor(
    private propiedadService: PropiedadService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private alerta: AlertaService
  ) {}

  ngOnInit() {
    this.cargarPropiedades();
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    this.wishlistService.obtenerFavoritos().subscribe({
      next: (res) => {
        this.favoritos = res.map((p: any) => p._id);
      },
      error: (err) => {
        console.error('Error al obtener favoritos:', err);
      },
    });
  }

  toggleFavorito(propiedadId: string) {
    if (!this.authService.estaAutenticado()) {
      this.alerta.mostrar('Debes de iniciar sesión');

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

      return;
    }

    if (this.esFavorito(propiedadId)) {
      this.wishlistService.eliminarDeFavoritos(propiedadId).subscribe({
        next: () => {
          this.favoritos = this.favoritos.filter((id) => id !== propiedadId);
        },
        error: (err) => console.error(err),
      });
    } else {
      this.wishlistService.agregarAFavoritos(propiedadId).subscribe({
        next: () => {
          this.favoritos.push(propiedadId);
        },
        error: (err) => console.error(err),
      });
    }
  }

  esFavorito(propiedadId: string): boolean {
    return this.favoritos.includes(propiedadId);
  }

  cambiarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.cargarPropiedades();
  }

  cargarPropiedades() {
    this.propiedadService
      .obtenerPropiedadesPublicadas({
        tipoPropiedad: this.tipoSeleccionado,
      })
      .subscribe({
        next: (res: any) => {
          this.propiedades = res.propiedades || res;
          this.propiedadesFiltradas = this.propiedades;
        },
        error: (err) => {
          console.error('Error al obtener propiedades:', err);
        },
      });
  }

  verMas() {
    const rutas: any = {
      casa: 'habitacional/casa',
      departamento: 'habitacional/departamento',
      terreno: 'comercial/terrenos',
      local: 'comercial/locales',
      bodega: 'comercial/bodegas',
      oficina: 'comercial/oficinas',
      edificio: 'comercial/edificios',
      rancho: 'comercial/ranchos',
    };

    const ruta = `/propiedades/${rutas[this.tipoSeleccionado] || ''}`;
    window.location.href = ruta;
  }
}
