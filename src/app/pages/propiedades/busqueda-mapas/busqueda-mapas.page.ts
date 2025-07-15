import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-busqueda-mapas',
  templateUrl: './busqueda-mapas.page.html',
  styleUrls: ['./busqueda-mapas.page.scss'],
  standalone: false,
})
export class BusquedaMapasPage implements OnInit {
  @ViewChild('mapa', { static: false }) mapaElementRef!: ElementRef;

  mapa!: google.maps.Map;
  circulo!: google.maps.Circle;
  centroMapa = { lat: 20.6767, lng: -100.3288 };
  radio = 500;

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
    this.obtenerUbicacionActual();
    this.cargarFavoritos();
  }

  obtenerUbicacionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.centroMapa = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          this.inicializarMapa();
          this.inicializarAutocomplete();
          this.buscarPropiedades();
        },
        (err) => {
          console.warn('Error al obtener ubicación:', err.message);

          this.inicializarMapa();
          this.inicializarAutocomplete();
          this.buscarPropiedades();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      console.warn('Geolocalización no soportada');
      this.inicializarMapa();
      this.inicializarAutocomplete();
      this.buscarPropiedades();
    }
  }

  ngAfterViewInit() {
    // this.inicializarMapa();
    // this.inicializarAutocomplete();
  }

  inicializarMapa() {
    this.mapa = new google.maps.Map(this.mapaElementRef.nativeElement, {
      center: this.centroMapa,
      zoom: 14,
      mapTypeControl: false,
    });

    this.circulo = new google.maps.Circle({
      map: this.mapa,
      center: this.centroMapa,
      radius: this.radio,
      editable: false,
      draggable: true,
      fillColor: '#ff6600',
      fillOpacity: 0.2,
      strokeColor: '#ff6600',
      strokeWeight: 2,
    });

    this.circulo.addListener('center_changed', () => {
      const centro = this.circulo.getCenter();
      this.centroMapa.lat = centro!.lat();
      this.centroMapa.lng = centro!.lng();
    });
  }

  inicializarAutocomplete() {
    const input = document.getElementById('autocomplete') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', this.mapa);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      this.centroMapa = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      this.mapa.setCenter(place.geometry.location);
      this.mapa.setZoom(15);

      this.circulo.setCenter(place.geometry.location);
    });
  }

  actualizarRadio() {
    if (this.circulo) {
      this.circulo.setRadius(this.radio);
    }

    const slider = document.getElementById('radio') as HTMLInputElement;

    if (!slider) return;

    const valorActual = +slider.value;
    const min = +slider.min;
    const max = +slider.max;
    const porcentaje = ((valorActual - min) * 100) / (max - min);

    slider.style.background = `linear-gradient(to right, #ff6600 0%, #ff6600 ${porcentaje}%, #ddd ${porcentaje}%, #ddd 100%)`;
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
      tipoOperacion: this.tipoOperacion,
      estadoPropiedad: this.estadoPropiedad,
      precioMax: this.precioMax,
      tipoPropiedad: this.tipoPropiedad,
      latitud: this.centroMapa.lat,
      longitud: this.centroMapa.lng,
      radio: this.radio,
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
