import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-edificios',
  templateUrl: './edificios.page.html',
  styleUrls: ['./edificios.page.scss'],
  standalone: false,
})
export class EdificiosPage implements OnInit {
  propiedades: any[] = [];
  keyword: string = '';
  tipoOperacion: string = '';
  estado: string = '';
  estadoPropiedad: string = '';
  precioMax: string = '';
  estados: string[] = ['activa', 'oportunidad', 'remate bancario'];

  paginaActual: number = 1;
  porPagina: number = 8;

  caracteristicas: any = {
    m2xPiso: '',
    pisosEdificio: '',
    oficinas: '',
    sistemaIncendios: false,
  };

  mostrarCaracteristicas: boolean = false;

  favoritos: string[] = [];

  constructor(
    private propiedadService: PropiedadService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private alerta: AlertaService,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    this.buscarPropiedades();
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    this.loading.mostrar();

    this.wishlistService.obtenerFavoritos().subscribe({
      next: (res) => {
        this.favoritos = res.map((p: any) => p._id);
        this.loading.ocultar();
      },
      error: (err) => {
        console.error('Error al obtener favoritos:', err);
        this.loading.ocultar();
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

    this.loading.mostrar();

    if (this.esFavorito(propiedadId)) {
      this.wishlistService.eliminarDeFavoritos(propiedadId).subscribe({
        next: () => {
          this.favoritos = this.favoritos.filter((id) => id !== propiedadId);
          this.loading.ocultar();
        },
        error: (err) => {console.error(err);
          this.loading.ocultar();},
      });
    } else {
      this.wishlistService.agregarAFavoritos(propiedadId).subscribe({
        next: () => {
          this.favoritos.push(propiedadId);
          this.loading.ocultar();
        },
        error: (err) => {console.error(err);
          this.loading.ocultar();
        },
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
      tipoPropiedad: 'edificio',
    };

    const hayCaracteristicas = Object.values(this.caracteristicas).some(
      (valor) => valor !== null && valor !== '' && valor !== false
    );

    if (hayCaracteristicas) {
      filtros.caracteristicas = JSON.stringify({
        edificio: this.caracteristicas,
      });
    }

    console.log(filtros);

    this.loading.mostrar();

    this.propiedadService.obtenerPropiedadesPublicadas(filtros).subscribe({
      next: (res: any) => {
        this.propiedades = res.propiedades || res;
        this.paginaActual = 1;
        this.loading.ocultar();
      },
      error: (err) => {
        console.error('Error al filtrar propiedades:', err);
        this.loading.ocultar();
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
