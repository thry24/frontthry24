import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { AlertaService } from 'src/app/services/alerta.service';

declare const google: any;

@Component({
  selector: 'app-editar',
  templateUrl: './editar-propiedad.page.html',
  styleUrls: ['./editar-propiedad.page.scss'],
  standalone: false,
})
export class EditarPropiedadPage implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  @ViewChild('autocompleteInput', { static: false })
  autocompleteInput!: ElementRef;

  map: any;
  marker: any;

  idPropiedad = '';
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

  datosPropietario = {
    nombre: '',
    telefono: '',
    email: '',
  };

  imagenPrincipalUrl: string | null = null;
  imagenesUrls: string[] = [];
  archivosNombres: string[] = [];

  imagenPrincipal: File | null = null;
  imagenes: File[] = [];
  archivos: File[] = [];

  generales: { [key: string]: boolean } = {};
  servicios: { [key: string]: boolean } = {};
  amenidades: { [key: string]: boolean | string } = {};

  caracteristicas: any = {};

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
  estados = ['activa', 'oportunidad', 'remate bancario', 'con inquilino'];

  mostrarGenerales = false;
  mostrarServicios = false;
  mostrarAmenidades = false;

  otroTerreno = false;
  otroTipoCentro = false;
  otraRestriccion = false;
  direccionFormateada = '';

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

  constructor(
    private route: ActivatedRoute,
    private propiedadService: PropiedadService,
    private alerta: AlertaService,
    private loading: LoadingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.generarCheckboxCols();
    this.generarCheckboxColsRancho();
    this.generarCheckboxColsOficina();
    this.generarCheckboxColsEdificio();
    this.generarCheckboxColsGenerales();
    this.generarCheckboxColsServicios();
    this.generarCheckboxColsAmenidades();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.idPropiedad = id;
        this.cargarPropiedad(id);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupAutocomplete();
  }

  cargarPropiedad(id: string) {
    this.loading.mostrar();
    this.propiedadService.obtenerPropiedadPorId(id).subscribe({
      next: (prop: any) => {
        this.tipoOperacion = prop.tipoOperacion;
        this.tipoPropiedad = prop.tipoPropiedad;
        this.precio = prop.precio;
        this.descripcion = prop.descripcion;
        this.estadoPropiedad = prop.estadoPropiedad;
        this.comisionComparte = prop.comision?.comparte || false;
        this.comisionPorcentaje = prop.comision?.porcentaje || 0;

        this.direccion = prop.direccion;
        this.datosPropietario = prop.datosPropietario || {};
        this.generales = prop.generales || {};
        this.servicios = prop.servicios || {};
        this.amenidades = prop.amenidades || {};
        this.caracteristicas = prop.caracteristicas || {};
        this.imagenesUrls = prop.imagenes || [];
        this.imagenes = [];
        this.archivosNombres = (prop.archivos || []).map((a: any) => a.nombre);
        this.imagenPrincipalUrl = prop.imagenPrincipal || null;

        console.log(prop);

        this.actualizarDireccionPorCoordenadas(
          this.direccion.lat,
          this.direccion.lng
        );
        this.loadMap();
        this.loading.ocultar();
      },
      error: () => {
        this.alerta.mostrar('Error al cargar los datos', 'error');
        this.loading.ocultar();
        this.router.navigate(['/home']);
      },
    });
  }

  onKmzFileSelected(event: any): void {
    const archivo: File = event.target.files[0];
    if (archivo && archivo.name.endsWith('.kmz')) {
      console.log('Archivo KMZ seleccionado:', archivo);
    } else {
      this.alerta.mostrar(
        'Solo se permiten archivos con extensión .kmz',
        'error'
      );
    }
  }

  async guardarCambios() {
    if (
      !this.tipoOperacion ||
      !this.tipoPropiedad ||
      !this.precio ||
      !this.datosPropietario.nombre ||
      !this.datosPropietario.telefono ||
      !this.datosPropietario.email
    ) {
      this.alerta.mostrar(
        'Por favor completa todos los campos obligatorios.',
        'warning'
      );
      return;
    }

    const propiedadEditada: any = {
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
      generales: this.generales,
      servicios: this.servicios,
      amenidades: this.amenidades,
      caracteristicas: this.caracteristicas,
    };

    const formData = new FormData();
    formData.append('datos', JSON.stringify(propiedadEditada));

    const urlsFiltradas = this.imagenesUrls.filter(
      (url) => !url.startsWith('data:')
    );
    formData.append('imagenesExistentes', JSON.stringify(urlsFiltradas));
    formData.append('archivosExistentes', JSON.stringify(this.archivosNombres));

    if (this.imagenPrincipal instanceof File) {
      formData.append('imagenPrincipal', this.imagenPrincipal);
      formData.append('imagenes', this.imagenPrincipal);
    }

    this.imagenes.forEach((img) => {
      if (typeof img !== 'string') {
        formData.append('imagenes', img);
      }
    });

    this.archivos.forEach((file) => {
      formData.append('archivos', file);
    });

    this.loading.mostrar();
    this.propiedadService
      .actualizarPropiedad(this.idPropiedad, formData)
      .subscribe({
        next: () => {
          this.loading.ocultar();
          this.alerta.mostrar('Propiedad actualizada con éxito.', 'success');
          window.location.href = '/agente/mis-publicaciones';
        },
        error: () => {
          this.loading.ocultar();
          this.alerta.mostrar('Error al actualizar la propiedad.', 'error');
        },
      });
  }

  onImagenPrincipalSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenPrincipal = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.imagenPrincipalUrl = result;

        if (!this.imagenesUrls.includes(result)) {
          this.imagenesUrls.push(result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onImagenesSeleccionadas(event: any) {
    const nuevosArchivos = Array.from(event.target.files) as File[];

    if (this.imagenes.length + nuevosArchivos.length > 10) {
      this.alerta.mostrar(
        'Solo puedes subir hasta 10 imágenes adicionales.',
        'warning'
      );
      return;
    }

    nuevosArchivos.forEach((file: File) => {
      const yaExisteNuevo = this.imagenes.some(
        (img) => img.name === file.name && img.size === file.size
      );

      const yaExisteEnBD = this.imagenesUrls.some((url) =>
        url.includes(file.name)
      );

      if (!yaExisteNuevo && !yaExisteEnBD) {
        this.imagenes.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          this.imagenesUrls.push(base64); 
        };
        reader.readAsDataURL(file);
      }
    });
  }

  onArchivosSeleccionados(event: any) {
    const nuevosArchivos = Array.from(event.target.files) as File[];

    if (this.archivos.length + nuevosArchivos.length > 5) {
      this.alerta.mostrar('Solo puedes subir hasta 5 archivos.', 'warning');
      return;
    }

    nuevosArchivos.forEach((file: File) => {
      this.archivos.push(file);
      this.archivosNombres.push(file.name);
    });
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

  eliminarImagenPrincipal() {
    this.imagenPrincipal = null;
    this.imagenPrincipalUrl = null;
  }

  eliminarImagen(index: number) {
    this.imagenes.splice(index, 1);
    this.imagenesUrls.splice(index, 1);
  }

  eliminarArchivo(index: number) {
    this.archivos.splice(index, 1);
    this.archivosNombres.splice(index, 1);
  }

  loadMap(): void {
    const lat = this.direccion.lat || 20.5888;
    const lng = this.direccion.lng || -100.3899;

    const center = { lat, lng };

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

    this.actualizarDireccionPorCoordenadas(lat, lng);

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

        this.direccionFormateada = address.formatted_address;

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
}
