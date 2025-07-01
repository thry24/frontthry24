import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { LoadingService } from '../../../services/loading.service';

declare const google: any;

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
  standalone: false,
})
export class AgregarPage implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  @ViewChild('autocompleteInput', { static: false })
  autocompleteInput!: ElementRef;

  map: any;
  marker: any;
mostrarGenerales = false;
mostrarServicios = false;
mostrarAmenidades = false;

  tipoOperacion = '';
  tipoPropiedad = '';
  precio!: number;
  descripcion = '';
  estadoPropiedad = 'activa';

  comisionComparte = false;
  comisionPorcentaje!: number;

  direccion = {
    estado: '',
    municipio: '',
    colonia: '',
    lat: 0,
    lng: 0,
  };
  otroTerreno = false;
  otroTipoCentro = false;
  otraRestriccion = false;
  mostrarPopoverGenerales = false;

  datosPropietario = {
    nombre: '',
    telefono: '',
    email: '',
  };

  caracteristicas: {
    casaDepto: {
      habitaciones: number;
      recamaraPB: boolean;
      banosCompletos: number;
      mediosBanos: number;
      estacionamiento: string;
      closetVestidor: string;
      superficie: string;
      construccion: string;
      pisos: number;
      cocina: string;
      [key: string]: any;
    };
    terreno: {
      m2Frente: string;
      m2Fondo: string;
      tipo: string;
      tipoOtro: String;
      costoXM2: string;
      kmz: boolean;
      agua: boolean;
      luz: boolean;
      drenaje: boolean;
    };
    local: {
      tipoCentro: string;
      tipoCentroOtro: string;
      plaza: string;
      pasillo: string;
      planta: string;
      m2Frente: string;
      m2Fondo: string;
      restriccionGiro: string;
      restriccionGiroOtro: string;
      giro: string;
      seguridad: boolean;
    };
    bodega: {
      tipo: string;
      m2Terreno: string;
      m2Construccion: string;
      oficinas: number;
      banos: number;
      recepcion: boolean;
      mezzanine: boolean;
      comedor: boolean;
      andenCarga: boolean;
      rampas: boolean;
      patioManiobras: boolean;
      resistenciaPiso: string;
      recoleccionResiduos: boolean;
      subestacion: boolean;
      cargaElectrica: string;
      kva: string;
      crossDocking: boolean;
      techoLoza: boolean;
      techoLamina: boolean;
      arcoTecho: boolean;
      banosEmpleados: number;
      [key: string]: any;
    };
    rancho: {
      hectareas: string;
      uso: string;
      usoOtro: string;
      pozo: boolean;
      corrales: boolean;
      casa: boolean;
      casco: boolean;
      establo: boolean;
      invernadero: boolean;
      bordo: boolean;
      [key: string]: any;
    };
    oficina: {
      superficie: String;
      privados: number;
      salaJuntas: number;
      banosPrivados: number;
      banosCompartidos: number;
      comedores: boolean;
      empleados: number;
      corporativo: boolean;
      [key: string]: any;
    };
    edificio: {
      m2xPiso: String;
      pisosEdificio: number;
      oficinas: number;
      sistemaIncendios: boolean;
      aguasPluviales: boolean;
      aguasNegras: boolean;
      gatosHidraulicos: boolean;
      autosustentable: boolean;
      estacionamientos: number;
      [key: string]: any;
    };
    
  } = {
    casaDepto: {
      habitaciones: 0,
      recamaraPB: false,
      banosCompletos: 0,
      mediosBanos: 0,
      estacionamiento: '',
      closetVestidor: '',
      superficie: '',
      construccion: '',
      pisos: 0,
      cocina: '',
      barraDesayunador: false,
      balcon: false,
      salaTV: false,
      estudio: false,
      areaLavado: false,
      cuartoServicio: false,
      sotano: false,
      jardin: false,
      terraza: false,
    },
    terreno: {
      m2Frente: '',
      m2Fondo: '',
      tipo: '',
      tipoOtro: '',
      costoXM2: '',
      kmz: false,
      agua: false,
      luz: false,
      drenaje: false,
    },
    local: {
      tipoCentro: '',
      tipoCentroOtro: '',
      plaza: '',
      pasillo: '',
      planta: '',
      m2Frente: '',
      m2Fondo: '',
      restriccionGiro: '',
      restriccionGiroOtro: '',
      giro: '',
      seguridad: false,
    },
    bodega: {
      tipo: '',
      m2Terreno: '',
      m2Construccion: '',
      oficinas: 0,
      banos: 0,
      recepcion: false,
      mezzanine: false,
      comedor: false,
      andenCarga: false,
      rampas: false,
      patioManiobras: false,
      resistenciaPiso: '',
      recoleccionResiduos: false,
      subestacion: false,
      cargaElectrica: '',
      kva: '',
      crossDocking: false,
      techoLoza: false,
      techoLamina: false,
      arcoTecho: false,
      banosEmpleados: 0,
    },
    rancho: {
      hectareas: '',
      uso: '',
      usoOtro: '',
      pozo: false,
      corrales: false,
      casa: false,
      casco: false,
      establo: false,
      invernadero: false,
      bordo: false,
    },
    oficina: {
      superficie: '',
      privados: 0,
      salaJuntas: 0,
      banosPrivados: 0,
      banosCompartidos: 0,
      comedores: false,
      empleados: 0,
      corporativo: false,
    },
    edificio: {
      m2xPiso: '',
      pisosEdificio: 0,
      oficinas: 0,
      sistemaIncendios: false,
      aguasPluviales: false,
      aguasNegras: false,
      gatosHidraulicos: false,
      autosustentable: false,
      estacionamientos: 0,
    },
  };

  generales: { [key: string]: boolean } = {
  cisterna: false,
  hidroneumatico: false,
  cancelesBano: false,
  riegoAspersion: false,
  calentadorSolar: false,
  lamparasSolares: false,
  aireAcondicionado: false,
  alarma: false,
  bodega: false,
  calefaccion: false,
  chimenea: false,
  circuitoCerrado: false,
  sistemaInteligente: false,
  elevador: false,
  seguridad24h: false,
  vistaPanoramica: false,
  vistaFloraFauna: false
};

servicios: { [key: string]: boolean } = {
  tipoGas: false,
  internet: false,
  telefonia: false,
  tv: false,
  enchufeCarros: false,
};
amenidades: {
  [key: string]: boolean | string;
} = {
  juegosInfantiles: false,
  campoGolf: false,
  gimnasio: false,
  ludoteca: false,
  salonEvento: false,
  asadores: false,
  lagos: false,
  petFriendly: false,
  piscina: false,
  jacuzzi: false,
  jogging: false,
  futbol: false,
  tenis: false,
  squash: false,
  paddle: false,
  basket: false,
  volley: false,
  vistaGolf: false,
  otros: '',
};

  checkboxCols: any[][] = [];
  checkboxColsBodega: any[][] = [];
  checkboxColsRancho: any[][] = [];
  checkboxColsOficina: any[][] = [];
  checkboxColsEdificio: any[][] = [];
  checkboxColsGenerales: any[][] = [];
  checkboxColsServicios: any[][] = [];
  checkboxColsAmenidades: any[][] = [];

  booleanosCasaDepto = [
    { key: 'barraDesayunador', label: 'Barra Desayunador' },
    { key: 'balcon', label: 'Balcón' },
    { key: 'salaTV', label: 'Sala de TV' },
    { key: 'estudio', label: 'Estudio' },
    { key: 'areaLavado', label: 'Área de Lavado' },
    { key: 'cuartoServicio', label: 'Cuarto de Servicio' },
    { key: 'sotano', label: 'Sótano' },
    { key: 'jardin', label: 'Jardín' },
    { key: 'terraza', label: 'Terraza' },
  ];

  booleanosBodega = [
    { key: 'recepcion', label: 'Recepción' },
    { key: 'mezzanine', label: 'Mezzanine' },
    { key: 'comedor', label: 'Comedor' },
    { key: 'andenCarga', label: 'Andén de Carga' },
    { key: 'rampas', label: 'Rampas' },
    { key: 'patioManiobras', label: 'Patio de Maniobras' },
    { key: 'recoleccionResiduos', label: 'Recolección de Residuos' },
    { key: 'subestacion', label: 'Subestación' },
    { key: 'crossDocking', label: 'Cross Docking' },
    { key: 'techoLoza', label: 'Techo de Loza' },
    { key: 'techoLamina', label: 'Techo de Lámina' },
    { key: 'arcoTecho', label: 'Arco Techo' },
  ];

  booleanosRancho = [
    { key: 'pozo', label: 'Pozo' },
    { key: 'corrales', label: 'Corrales' },
    { key: 'casa', label: 'Casa' },
    { key: 'casco', label: 'Casco' },
    { key: 'establo', label: 'Establo' },
    { key: 'invernadero', label: 'Invernadero' },
    { key: 'bordo', label: 'Bordo' },
  ];

  booleanosOficina = [
    { key: 'comedores', label: 'Comedor(es)' },
    { key: 'corporativo', label: '¿Es corporativo?' },
  ];

  booleanosEdificio = [
    { key: 'sistemaIncendios', label: 'Sistema Contra Incendios' },
    { key: 'aguasPluviales', label: 'Drenaje Pluvial' },
    { key: 'aguasNegras', label: 'Drenaje de Aguas Negras' },
    { key: 'gatosHidraulicos', label: 'Gatos Hidráulicos' },
    { key: 'autosustentable', label: 'Autosustentable' },
  ];

  booleanosGenerales = [
  { key: 'cisterna', label: 'Cisterna' },
  { key: 'hidroneumatico', label: 'Hidroneumático' },
  { key: 'cancelesBano', label: 'Canceles de Baño' },
  { key: 'riegoAspersion', label: 'Riego por Aspersión' },
  { key: 'calentadorSolar', label: 'Calentador Solar' },
  { key: 'lamparasSolares', label: 'Lámparas Solares' },
  { key: 'aireAcondicionado', label: 'Aire Acondicionado' },
  { key: 'alarma', label: 'Alarma' },
  { key: 'bodega', label: 'Bodega' },
  { key: 'calefaccion', label: 'Calefacción' },
  { key: 'chimenea', label: 'Chimenea' },
  { key: 'circuitoCerrado', label: 'Circuito Cerrado' },
  { key: 'sistemaInteligente', label: 'Sistema Inteligente' },
  { key: 'elevador', label: 'Elevador' },
  { key: 'seguridad24h', label: 'Seguridad 24/7' },
  { key: 'vistaPanoramica', label: 'Vista Panorámica' },
  { key: 'vistaFloraFauna', label: 'Vista Flora y Fauna' },
];

booleanosServicios = [
  { key: 'tipoGas', label: 'Gas' },
  { key: 'internet', label: 'Internet' },
  { key: 'telefonia', label: 'Telefonía' },
  { key: 'tv', label: 'TV por cable' },
  { key: 'enchufeCarros', label: 'Enchufe p/ autos eléctricos' },
];

booleanosAmenidades = [
  { key: 'juegosInfantiles', label: 'Juegos Infantiles' },
  { key: 'campoGolf', label: 'Campo de Golf' },
  { key: 'gimnasio', label: 'Gimnasio' },
  { key: 'ludoteca', label: 'Ludoteca' },
  { key: 'salonEvento', label: 'Salón de Eventos' },
  { key: 'asadores', label: 'Asadores' },
  { key: 'lagos', label: 'Lagos' },
  { key: 'petFriendly', label: 'Pet Friendly' },
  { key: 'piscina', label: 'Piscina' },
  { key: 'jacuzzi', label: 'Jacuzzi' },
  { key: 'jogging', label: 'Pista de Jogging' },
  { key: 'futbol', label: 'Cancha de Futbol' },
  { key: 'tenis', label: 'Cancha de Tenis' },
  { key: 'squash', label: 'Squash' },
  { key: 'paddle', label: 'Paddle' },
  { key: 'basket', label: 'Cancha de Basket' },
  { key: 'volley', label: 'Cancha de Volley' },
  { key: 'vistaGolf', label: 'Vista al Campo de Golf' },
];


  tiposPropiedad = [
    'casa',
    'departamento',
    'terreno',
    'local',
    'bodega',
    'rancho',
    'oficina',
    'edificio',
  ];
  estados = ['activa', 'oportunidad', 'remate bancario'];

  constructor(private loading: LoadingService) {}
  ngOnInit(): void {
    this.generarCheckboxCols();
    this.generarCheckboxColsRancho();
    this.generarCheckboxColsOficina();
    this.generarCheckboxColsEdificio();
    this.generarCheckboxColsGenerales();
    this.generarCheckboxColsServicios();
    this.generarCheckboxColsAmenidades();
  }

  ngAfterViewInit(): void {
    this.loadMap();
    this.setupAutocomplete();
  }

  

  onKmzFileSelected(event: any): void {
    const archivo: File = event.target.files[0];
    if (archivo && archivo.name.endsWith('.kmz')) {
      console.log('Archivo KMZ seleccionado:', archivo);
    } else {
      alert('Solo se permiten archivos con extensión .kmz');
    }
  }

  generarCheckboxCols() {
    const col1 = this.booleanosCasaDepto.filter((_, i) => i % 2 === 0);
    const col2 = this.booleanosCasaDepto.filter((_, i) => i % 2 !== 0);
    this.checkboxCols = [col1, col2];

    const colB1 = this.booleanosBodega.filter((_, i) => i % 2 === 0);
    const colB2 = this.booleanosBodega.filter((_, i) => i % 2 !== 0);
    this.checkboxColsBodega = [colB1, colB2];
  }

  generarCheckboxColsRancho() {
    const col1 = this.booleanosRancho.filter((_, i) => i % 2 === 0);
    const col2 = this.booleanosRancho.filter((_, i) => i % 2 !== 0);
    this.checkboxColsRancho = [col1, col2];
  }

  generarCheckboxColsOficina() {
    const col1 = this.booleanosOficina.filter((_, i) => i % 2 === 0);
    const col2 = this.booleanosOficina.filter((_, i) => i % 2 !== 0);
    this.checkboxColsOficina = [col1, col2];
  }

  generarCheckboxColsEdificio() {
    const col1 = this.booleanosEdificio.filter((_, i) => i % 2 === 0);
    const col2 = this.booleanosEdificio.filter((_, i) => i % 2 !== 0);
    this.checkboxColsEdificio = [col1, col2];
  }

  generarCheckboxColsGenerales() {
  const col1 = this.booleanosGenerales.filter((_, i) => i % 2 === 0);
  const col2 = this.booleanosGenerales.filter((_, i) => i % 2 !== 0);
  this.checkboxColsGenerales = [col1, col2];
}

generarCheckboxColsServicios() {
  const col1 = this.booleanosServicios.filter((_, i) => i % 2 === 0);
  const col2 = this.booleanosServicios.filter((_, i) => i % 2 !== 0);
  this.checkboxColsServicios = [col1, col2];
}

generarCheckboxColsAmenidades() {
  const col1 = this.booleanosAmenidades.filter((_, i) => i % 2 === 0);
  const col2 = this.booleanosAmenidades.filter((_, i) => i % 2 !== 0);
  this.checkboxColsAmenidades = [col1, col2];
}


  loadMap(): void {
    const center = { lat: 20.5888, lng: -100.3899 };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center,
      zoom: 14,
      mapId: 'DEMO_MAP_ID',
    });

    const { AdvancedMarkerElement } = google.maps.marker;

    this.marker = new AdvancedMarkerElement({
      map: this.map,
      position: center,
      gmpDraggable: true,
    });

    this.actualizarDireccionPorCoordenadas(center.lat, center.lng);

    this.marker.addListener('gmp-dragend', (event: any) => {
      const pos = event.latLng;
      const lat = pos.lat();
      const lng = pos.lng();
      this.marker.position = { lat, lng };
      this.actualizarDireccionPorCoordenadas(lat, lng);
    });

    this.map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.marker.position = { lat, lng };
      this.actualizarDireccionPorCoordenadas(lat, lng);
    });
  }

  setupAutocomplete(): void {
    const input = this.autocompleteInput?.nativeElement;
    if (!(input instanceof HTMLInputElement)) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['geocode'],
      componentRestrictions: { country: 'mx' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const location = place.geometry.location;
      const lat = location.lat();
      const lng = location.lng();

      this.map.setCenter({ lat, lng });
      this.marker.position = { lat, lng };

      this.actualizarDireccionPorCoordenadas(lat, lng);
    });
  }

  actualizarDireccionPorCoordenadas(lat: number, lng: number): void {
    this.loading.mostrar();

    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results: any, status: any) => {
      this.loading.ocultar();

      this.direccion.estado = '';
      this.direccion.municipio = '';
      this.direccion.colonia = '';
      this.direccion.lat = lat;
      this.direccion.lng = lng;

      if (status === 'OK' && results[0]) {
        const address = results[0];

        for (const comp of address.address_components) {
          const types = comp.types;

          if (types.includes('administrative_area_level_1')) {
            this.direccion.estado = comp.long_name;
          }

          if (types.includes('locality') && !this.direccion.municipio) {
            this.direccion.municipio = comp.long_name;
          } else if (
            types.includes('administrative_area_level_2') &&
            !this.direccion.municipio
          ) {
            this.direccion.municipio = comp.long_name;
          }

          if (
            (types.includes('neighborhood') || types.includes('sublocality')) &&
            !this.direccion.colonia
          ) {
            this.direccion.colonia = comp.long_name;
          }
        }
      }
    });
  }

  formatearMoneda(valor: number): string {
    if (!valor && valor !== 0) return '';
    return `$${valor.toLocaleString('es-MX', { minimumFractionDigits: 0 })}`;
  }

  formatearPorcentaje(valor: number): string {
    if (!valor && valor !== 0) return '';
    return `${valor}%`;
  }

  limpiarNumero(event: any): number {
    const valorLimpio = event?.target?.value?.replace(/[^0-9.]/g, '');
    return parseFloat(valorLimpio || '0');
  }

  guardarPropiedad() {
    const tipoFinalTerreno =
      this.caracteristicas.terreno.tipo === 'otro'
        ? this.caracteristicas.terreno.tipoOtro
        : this.caracteristicas.terreno.tipo;

    const tipoFinalCentro =
      this.caracteristicas.local.tipoCentro === 'otro'
        ? this.caracteristicas.local.tipoCentroOtro
        : this.caracteristicas.local.tipoCentro;

    const restriccionFinal =
      this.caracteristicas.local.restriccionGiro === 'otra'
        ? this.caracteristicas.local.restriccionGiroOtro
        : this.caracteristicas.local.restriccionGiro;

    const propiedadAGuardar: any = {
      tipoOperacion: this.tipoOperacion,
      tipoPropiedad: this.tipoPropiedad,
      precio: this.precio,
      descripcion: this.descripcion,
      estadoPropiedad: this.estadoPropiedad,
      comision: this.comisionComparte
        ? { porcentaje: this.comisionPorcentaje, comparte: true }
        : { comparte: false },
      direccion: this.direccion,
      datosPropietario: this.datosPropietario,
    };

    if (
      this.tipoPropiedad === 'casa' ||
      this.tipoPropiedad === 'departamento'
    ) {
      propiedadAGuardar.caracteristicas = {
        casaDepto: this.caracteristicas.casaDepto,
      };
    } else if (this.tipoPropiedad === 'terreno') {
      propiedadAGuardar.caracteristicas = {
        terreno: {
          ...this.caracteristicas.terreno,
          tipo: tipoFinalTerreno,
        },
      };
    } else if (this.tipoPropiedad === 'local') {
      propiedadAGuardar.caracteristicas = {
        local: {
          ...this.caracteristicas.local,
          tipoCentro: tipoFinalCentro,
          restriccionGiro: restriccionFinal,
        },
      };
    } else if (this.tipoPropiedad === 'bodega') {
      propiedadAGuardar.caracteristicas = {
        bodega: { ...this.caracteristicas.bodega },
      };
    } else if (this.tipoPropiedad === 'rancho') {
      const usoFinal =
        this.caracteristicas.rancho.uso === 'otro'
          ? this.caracteristicas.rancho.usoOtro
          : this.caracteristicas.rancho.uso;

      propiedadAGuardar.caracteristicas = {
        rancho: {
          ...this.caracteristicas.rancho,
          uso: usoFinal,
        },
      };
    } else if (this.tipoPropiedad === 'oficina') {
      propiedadAGuardar.caracteristicas = {
        oficina: { ...this.caracteristicas.oficina },
      };
    } else if (this.tipoPropiedad === 'edificio') {
      propiedadAGuardar.caracteristicas = {
        edificio: { ...this.caracteristicas.edificio },
      };
    }

    propiedadAGuardar.generales = this.generales;
    propiedadAGuardar.servicios = this.servicios;
    propiedadAGuardar.amenidades = this.amenidades;



    console.log('Datos a guardar:', propiedadAGuardar);
  }
}
