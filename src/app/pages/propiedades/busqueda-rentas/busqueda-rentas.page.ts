import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-busqueda-rentas',
  templateUrl: './busqueda-rentas.page.html',
  styleUrls: ['./busqueda-rentas.page.scss'],
  standalone: false,
})
export class BusquedaRentasPage implements OnInit {
  costoXM2Formateado: string = '';
  propiedades: any[] = [];
  keyword: string = '';
  tipoOperacion: string = '';
  tipoPropiedad: string = '';
  estado: string = '';
  estadoPropiedad: string = '';
  precioMax: string = '';
  estados: string[] = [
    'activa',
    'oportunidad',
    'remate bancario',
    'con inquilino',
  ];

  paginaActual: number = 1;
  porPagina: number = 8;
  tipoSeleccionado: string = '';

  caracteristicas: any = {
    tipo: '',
    m2Terreno: '',
    m2Construccion: '',
    oficinas: '',
    m2xPiso: '',
    pisosEdificio: '',
    sistemaIncendios: false,
    tipoCentro: '',
    plaza: '',
    pasillo: '',
    planta: '',
    superficie: '',
    privados: '',
    salaJuntas: '',
    banosPrivados: '',
    hectareas: '',
    uso: '',
    pozo: false,
    corrales: false,
    m2Frente: '',
    m2Fondo: '',
    costoXM2: '',
    habitaciones: null,
    banosCompletos: null,
    mediosBanos: null,
    estacionamiento: '',
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

  onTipoPropiedadChange() {
    this.tipoSeleccionado = this.tipoPropiedad;

    const hayCaracteristicas = Object.values(this.caracteristicas).some(
      (valor) => valor !== null && valor !== '' && valor !== false
    );

    this.mostrarCaracteristicas = hayCaracteristicas;
  }

  formatearCostoXM2(event: any): void {
    let entrada = event.target.value;

    const valorNumerico = entrada.replace(/\D/g, '');

    this.caracteristicas.costoXM2 = valorNumerico;

    const numero = parseFloat(valorNumerico);
    this.costoXM2Formateado = isNaN(numero)
      ? ''
      : numero.toLocaleString('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
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
        error: (err) => {
          console.error(err);
          this.loading.ocultar();
        },
      });
    } else {
      this.wishlistService.agregarAFavoritos(propiedadId).subscribe({
        next: () => {
          this.favoritos.push(propiedadId);
          this.loading.ocultar();
        },
        error: (err) => {
          console.error(err);
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
      tipoOperacion: 'renta',
      estado: this.estado,
      estadoPropiedad: this.estadoPropiedad,
      precioMax: this.precioMax,
      tipoPropiedad: this.tipoPropiedad,
    };

    const tipoCaract =
      this.tipoPropiedad === 'casa' || this.tipoPropiedad === 'departamento'
        ? 'casaDepto'
        : this.tipoPropiedad;

    const hayCaracteristicas = Object.values(this.caracteristicas).some(
      (valor) => valor !== null && valor !== '' && valor !== false
    );

    if (hayCaracteristicas && tipoCaract) {
      filtros.caracteristicas = JSON.stringify({
        [tipoCaract]: this.caracteristicas,
      });
    }

    this.loading.mostrar();
    console.log(filtros);

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
