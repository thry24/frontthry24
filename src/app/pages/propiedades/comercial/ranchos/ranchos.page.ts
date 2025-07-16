import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';
import { LoadingService } from 'src/app/services/loading.service';
import { CompararService } from 'src/app/services/comparar.service';

@Component({
  selector: 'app-ranchos',
  templateUrl: './ranchos.page.html',
  styleUrls: ['./ranchos.page.scss'],
  standalone: false,
})
export class RanchosPage implements OnInit {
  propiedades: any[] = [];
  keyword: string = '';
  tipoOperacion: string = '';
  estado: string = '';
  estadoPropiedad: string = '';
  precioMax: string = '';
  estados: string[] = ['activa', 'oportunidad', 'remate bancario', 'con inquilino'];

  paginaActual: number = 1;
  porPagina: number = 8;

  caracteristicas: any = {
    hectareas: '',
    uso: '',
    pozo: false,
    corrales: false,
  };

  mostrarCaracteristicas: boolean = false;

  favoritos: string[] = [];
  comparadas: string[] = [];

  constructor(
    private propiedadService: PropiedadService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private alerta: AlertaService,
    private loading: LoadingService,
    private comparar: CompararService
  ) {}

  ngOnInit() {
    this.buscarPropiedades();
    this.cargarFavoritos();
    this.cargarComparadas();
  }

     cargarComparadas() {
  this.loading.mostrar();
  this.comparar.obtenerComparaciones().subscribe({
    next: (res) => {
      this.comparadas = res.map((p: any) => p._id);
      this.loading.ocultar();
    },
    error: (err) => {
      console.error('Error al obtener comparaciones:', err);
      this.loading.ocultar();
    },
  });
}

toggleComparar(event: Event, propiedadId: string, tipoPropiedad: string) {
  event.stopPropagation();

  if (!this.authService.estaAutenticado()) {
    this.alerta.mostrar('Debes iniciar sesión para comparar propiedades');

    setTimeout(() => {
      window.location.href = '/login';
    }, 3000);

    return;
  }

  this.loading.mostrar();

  if (this.esComparada(propiedadId)) {
    this.comparar.eliminarDeComparacion(propiedadId).subscribe({
      next: (res: any) => {
        this.comparadas = this.comparadas.filter((id) => id !== propiedadId);
        if (res?.msg) {
          this.alerta.mostrar(res.msg); 
        }
        this.loading.ocultar();
      },
      error: (err) => {
        console.error(err);
        this.alerta.mostrar(err.error?.msg || 'Error al eliminar de comparación.');
        this.loading.ocultar();
      },
    });
  } else {
    this.comparar.agregarAComparacion(propiedadId, tipoPropiedad).subscribe({
      next: (res: any) => {
        this.comparadas.push(propiedadId);
        if (res?.msg) {
          this.alerta.mostrar(res.msg);
        }
        if (res?.advertencia) {
          this.alerta.mostrar(res.advertencia);
        }
        this.loading.ocultar();
      },
      error: (err) => {
        console.error(err);
        this.alerta.mostrar(err.error?.msg || 'Error al agregar a comparación.');
        this.loading.ocultar();
      },
    });
  }
}


esComparada(propiedadId: string): boolean {
  return this.comparadas.includes(propiedadId);
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

  toggleFavorito(event: Event, propiedadId: string) {
    event.stopPropagation();
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
          this.loading.ocultar();
        },
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
      tipoPropiedad: 'rancho',
    };

    const hayCaracteristicas = Object.values(this.caracteristicas).some(
      (valor) => valor !== null && valor !== '' && valor !== false
    );

    if (hayCaracteristicas) {
      filtros.caracteristicas = JSON.stringify({
        rancho: this.caracteristicas,
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
