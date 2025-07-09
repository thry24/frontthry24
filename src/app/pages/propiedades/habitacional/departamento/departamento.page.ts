import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';
@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.page.html',
  styleUrls: ['./departamento.page.scss'],
  standalone: false,
})
export class DepartamentoPage implements OnInit {
  propiedades: any[] = [];
  keyword: string = '';
  tipoOperacion: string = '';
  estado: string = '';
  estadoPropiedad: string = '';
  precioMax: string = '';
  estados: string[] = ['activa', 'oportunidad', 'remate bancario'];

  paginaActual: number = 1;
  porPagina: number = 8;
  favoritos: string[] = [];

  caracteristicas: any = {
    habitaciones: null,
    banosCompletos: null,
    mediosBanos: null,
    estacionamiento: '',
  };

  mostrarCaracteristicas: boolean = false;

  constructor(
    private propiedadService: PropiedadService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private alerta: AlertaService
  ) {}

  ngOnInit() {
    this.buscarPropiedades();
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

  get propiedadesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.propiedades.slice(inicio, inicio + this.porPagina);
  }

  totalPaginas(): number {
    return Math.ceil(this.propiedades.length / this.porPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
    }
  }

  formatearPrecio(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    valor = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(Number(valor));

    event.target.value = valor;
  }

  buscarPropiedades() {
    const filtros: any = {
      keyword: this.keyword,
      tipoOperacion: this.tipoOperacion,
      estado: this.estado,
      estadoPropiedad: this.estadoPropiedad,
      precioMax: this.precioMax,
      tipoPropiedad: 'departamento',
    };

    const hayCaracteristicas = Object.values(this.caracteristicas).some(
      (valor) => valor !== null && valor !== '' && valor !== false
    );

    if (hayCaracteristicas) {
      filtros.caracteristicas = JSON.stringify({
        casaDepto: this.caracteristicas,
      });
    }

    console.log(filtros);

    this.propiedadService.obtenerPropiedadesPublicadas(filtros).subscribe({
      next: (res: any) => {
        this.propiedades = res.propiedades || res;
        this.paginaActual = 1;
      },
      error: (err) => {
        console.error('Error al filtrar propiedades:', err);
      },
    });
  }

  mensajeWhatsApp(propiedad: any): string {
    return encodeURIComponent(
      `Hola, estoy interesado en la propiedad con clave ${propiedad.clave}, ubicada en ${propiedad.direccion?.municipio}, ${propiedad.direccion?.estado}. ¿Podrías brindarme más información?`
    );
  }

  asuntoEmail(propiedad: any): string {
    return encodeURIComponent(`Interés en propiedad clave ${propiedad.clave}`);
  }

  cuerpoEmail(propiedad: any): string {
    return encodeURIComponent(
      `Hola,\n\nEstoy interesado en la propiedad con clave ${propiedad.clave}, ubicada en ${propiedad.direccion?.municipio}, ${propiedad.direccion?.estado}.\n\n¿Podrías brindarme más detalles?\n\nGracias.`
    );
  }
}
