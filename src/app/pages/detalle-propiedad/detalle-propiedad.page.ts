import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';
import { LoadingService } from 'src/app/services/loading.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { CompararService } from 'src/app/services/comparar.service';
import { AlertController } from '@ionic/angular';
import { PdfPropiedadService } from 'src/app/services/pdf-propiedad.service';
@Component({
  selector: 'app-detalle-propiedad',
  templateUrl: './detalle-propiedad.page.html',
  styleUrls: ['./detalle-propiedad.page.scss'],
  standalone: false,
})
export class DetallePropiedadPage implements OnInit {
  propiedad: any = null;
  citaAgendada: boolean = false;
  hoy: string = '';
  minHora: string = '00:00';
  imagenActual: string = '';
  favoritos: string[] = [];
  comparadas: string[] = [];
  verMas: boolean = false;
  usuarioActivo: any = null;
  cita = {
    nombre: '',
    email: '',
    fecha: '',
    hora: '',
    mensaje: '',
  };

  lugaresCercanos: { nombre: string; tipo: string }[] = [];
  conteoLugares: { [tipo: string]: number } = {};
  tiposLugares: string[] = [
    'hospital',
    'restaurant',
    'school',
    'park',
    'church',
    'bus_stop',
  ];

  constructor(
    private propiedadService: PropiedadService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertaService: AlertaService,
    private loadingService: LoadingService,
    private wishlistService: WishlistService,
    private comparar: CompararService,
    private pdfService: PdfPropiedadService,
    private alertCtrl: AlertController
  ) {}

  get iconoTipoPropiedad(): string {
    switch (this.propiedad?.tipoPropiedad) {
      case 'casa':
        return 'home-outline';
      case 'departamento':
        return 'business-outline';
      case 'terreno':
        return 'leaf-outline';
      case 'local':
        return 'storefront-outline';
      case 'bodega':
        return 'cube-outline';
      case 'rancho':
        return 'earth-outline';
      case 'oficina':
        return 'briefcase-outline';
      case 'edificio':
        return 'layers-outline';
      default:
        return 'help-outline';
    }
  }

  ngOnInit() {
    this.cargarFavoritos();
    this.cargarComparadas();

    const usuario = this.authService.obtenerUsuario();
    this.usuarioActivo = usuario || null;
    console.log('Usuario activo:', this.usuarioActivo);

    if (usuario) {
      this.cita.nombre = usuario.nombre || '';
      this.cita.email = usuario.correo || '';
    }

    const hoy = new Date();
    this.hoy = hoy.toISOString().split('T')[0];
    this.validarHora();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadingService.mostrar();
        this.propiedadService.obtenerPropiedadPorId(id).subscribe({
          next: (res) => {
            this.propiedad = res;
            this.imagenActual = this.propiedad.imagenPrincipal || '';
            console.log('Propiedad recibida:', res);
            this.loadingService.ocultar();

            setTimeout(() => {
              if (
                this.propiedad?.direccion?.lat &&
                this.propiedad?.direccion?.lng
              ) {
                this.cargarMapa(
                  this.propiedad.direccion.lat,
                  this.propiedad.direccion.lng
                );
              }
            }, 300);
          },
          error: (err) => {
            console.error('Error al obtener propiedad', err);
            this.loadingService.ocultar();
            this.alertaService.mostrar(
              'Error al cargar la propiedad. Inténtalo más tarde.',
              'error'
            );
          },
        });
      }
    });
  }
private async convertirImagenesABase64(urls: string[]): Promise<string[]> {
  const resultados: string[] = [];

  for (const url of urls) {
    try {
      const base64 = await this.convertirImagenABase64(url);
      if (base64) resultados.push(base64);
    } catch (error) {
      console.warn(`Error al convertir imagen ${url} a base64`, error);
    }
  }

  return resultados;
}

  ngAfterViewInit() {}

  private async convertirImagenABase64(url: string): Promise<string | null> {
    if (!url) return null;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error convirtiendo imagen a base64:', url, error);
      return null;
    }
  }

 async mostrarOpcionesPDF() {
  const alert = await this.alertCtrl.create({
  header: '¿Cómo deseas generar la ficha?',
  message: 'Elige cómo mostrar los datos de contacto en el PDF:',
  cssClass: 'alert-opciones-ficha',
  buttons: [
    {
      text: 'CON DATOS DEL ASESOR',
      handler: () => this.generarPDF('asesor'),
      cssClass: 'btn-opcion',
    },
    {
      text: 'CON MIS DATOS',
      handler: () => this.generarPDF('usuario'),
      cssClass: 'btn-opcion',
    },
    {
      text: 'SIN DATOS DE CONTACTO',
      handler: () => this.generarPDF('ninguno'),
      cssClass: 'btn-opcion',
    },
    {
      text: 'CANCELAR',
      role: 'cancel',
      cssClass: 'btn-cancelar',
    },
  ],
});
await alert.present();

}



  async generarPDF(opcion: 'asesor' | 'usuario' | 'ninguno') {
  if (!this.propiedad) return;

  this.loadingService.mostrar();

  try {
    const imagenPrincipalBase64 =
      this.propiedad.imagenPrincipalBase64 ||
      (await this.convertirImagenABase64(this.propiedad.imagenPrincipal));

    let logoBase64 = '';

if (opcion === 'usuario') {
  logoBase64 = (await this.convertirImagenABase64(
  this.usuarioActivo?.fotoPerfil || this.usuarioActivo?.logo
)) ?? '';

} else if (opcion === 'asesor') {
  logoBase64 = (await this.convertirImagenABase64(
  this.propiedad.agente?.fotoPerfil || this.propiedad.agente?.logo
)) ?? '';

}



    const mapaBase64 =
      this.propiedad.mapaBase64 ||
      (await this.pdfService.obtenerMapaBase64(
        this.propiedad.direccion?.lat,
        this.propiedad.direccion?.lng
      ));

    const logoAi24Path = 'assets/logo-ai24.jpeg';
    const logoAi24Base64 = await this.convertirImagenABase64(logoAi24Path);

    const imagenesBase64 = await this.convertirImagenesABase64(this.propiedad.imagenes || []);

    const propiedadConBase64 = {
      ...this.propiedad,
      imagenPrincipalBase64,
      logoBase64,
      logoAi24Base64,
      imagenesBase64,
      mapaBase64,
    };

    await this.pdfService.generarPDF(propiedadConBase64, opcion, this.usuarioActivo);
    this.alertaService.mostrar('PDF generado con éxito.', 'success');

  } catch (error) {
    console.error('Error generando PDF:', error);
    this.alertaService.mostrar('Error al generar el PDF.', 'error');
  } finally {
    this.loadingService.ocultar();
  }
}

  

  esFavorito(id: string): boolean {
    return this.favoritos.includes(id);
  }

  toggleFavorito(propiedadId: string) {
    if (!this.authService.estaAutenticado()) {
      this.alertaService.mostrar('Debes iniciar sesión para guardar favoritos');

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      return;
    }

    this.loadingService.mostrar();

    if (this.esFavorito(propiedadId)) {
      this.wishlistService.eliminarDeFavoritos(propiedadId).subscribe({
        next: () => {
          this.favoritos = this.favoritos.filter((id) => id !== propiedadId);
          this.loadingService.ocultar();
        },
        error: (err) => {
          console.error(err);
          this.loadingService.ocultar();
        },
      });
    } else {
      this.wishlistService.agregarAFavoritos(propiedadId).subscribe({
        next: () => {
          this.favoritos.push(propiedadId);
          this.loadingService.ocultar();
        },
        error: (err) => {
          console.error(err);
          this.loadingService.ocultar();
        },
      });
    }
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
  cargarComparadas() {
    this.loadingService.mostrar();
    this.comparar.obtenerComparaciones().subscribe({
      next: (res) => {
        this.comparadas = res.map((p: any) => p._id);
        this.loadingService.ocultar();
      },
      error: (err) => {
        console.error('Error al obtener comparaciones:', err);
        this.loadingService.ocultar();
      },
    });
  }

  toggleComparar(event: Event, propiedadId: string, tipoPropiedad: string) {
    event.stopPropagation();

    if (!this.authService.estaAutenticado()) {
      this.alertaService.mostrar(
        'Debes iniciar sesión para comparar propiedades'
      );

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

      return;
    }

    this.loadingService.mostrar();

    if (this.esComparada(propiedadId)) {
      this.comparar.eliminarDeComparacion(propiedadId).subscribe({
        next: (res: any) => {
          this.comparadas = this.comparadas.filter((id) => id !== propiedadId);
          if (res?.msg) {
            this.alertaService.mostrar(res.msg);
          }
          this.loadingService.ocultar();
        },
        error: (err) => {
          console.error(err);
          this.alertaService.mostrar(
            err.error?.msg || 'Error al eliminar de comparación.'
          );
          this.loadingService.ocultar();
        },
      });
    } else {
      this.comparar.agregarAComparacion(propiedadId, tipoPropiedad).subscribe({
        next: (res: any) => {
          this.comparadas.push(propiedadId);
          if (res?.msg) {
            this.alertaService.mostrar(res.msg);
          }
          if (res?.advertencia) {
            this.alertaService.mostrar(res.advertencia);
          }
          this.loadingService.ocultar();
        },
        error: (err) => {
          console.error(err);
          this.alertaService.mostrar(
            err.error?.msg || 'Error al agregar a comparación.'
          );
          this.loadingService.ocultar();
        },
      });
    }
  }

  esComparada(propiedadId: string): boolean {
    return this.comparadas.includes(propiedadId);
  }

  cargarMapa(lat: number, lng: number) {
    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat, lng },
        zoom: 15,
        disableDefaultUI: true,
      }
    );

    new google.maps.Circle({
      strokeColor: '#ff6600',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#ff6600',
      fillOpacity: 0.2,
      map,
      center: { lat, lng },
      radius: 500,
    });

    this.buscarLugaresCercanos(lat, lng);
  }

  buscarLugaresCercanos(lat: number, lng: number) {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    this.lugaresCercanos = [];
    this.conteoLugares = {};

    this.tiposLugares.forEach((tipo) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(lat, lng),
        radius: 500,
        type: tipo,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const encontrados = results
            .filter((lugar) => !!lugar.name)
            .map((lugar) => ({
              nombre: lugar.name!,
              tipo,
            }));

          this.lugaresCercanos.push(...encontrados);
          this.conteoLugares[tipo] =
            (this.conteoLugares[tipo] || 0) + encontrados.length;
        } else {
          this.conteoLugares[tipo] = 0;
        }
      });
    });
  }

  iconoCategoria(tipo: string): string {
    switch (tipo) {
      case 'hospital':
        return 'medkit-outline';
      case 'restaurant':
        return 'restaurant-outline';
      case 'school':
        return 'school-outline';
      case 'park':
        return 'leaf-outline';
      case 'church':
        return 'home-outline';
      case 'bus_station':
        return 'bus-outline';
      default:
        return 'location-outline';
    }
  }

  get keywordsLimpios(): string[] {
    return (this.propiedad?.keywords || [])
      .filter((k: any) => typeof k === 'string' && !/\[object Object\]/.test(k))
      .map((k: string) => k.trim());
  }

  get citaValida(): boolean {
    return !!(
      this.cita.nombre &&
      this.cita.email &&
      this.cita.fecha &&
      this.cita.hora
    );
  }

  generarMailto(): string {
    const asunto = encodeURIComponent('Solicitud de cita para propiedad');
    const cuerpo = encodeURIComponent(`
Hola ${this.propiedad.agente?.nombre},

Estoy interesado en agendar una cita para visitar la propiedad "${
      this.propiedad.clave
    }".

Datos de la cita:
- Nombre: ${this.cita.nombre}
- Correo: ${this.cita.email}
- Fecha: ${this.cita.fecha}
- Hora: ${this.cita.hora}
- Mensaje adicional: ${this.cita.mensaje || 'N/A'}

Saludos.
    `);

    return `mailto:${this.propiedad.agente?.correo}?subject=${asunto}&body=${cuerpo}`;
  }

  generarWhatsAppLink(): string {
    const mensaje = encodeURIComponent(`
Hola ${this.propiedad.agente?.nombre}, soy ${
      this.cita.nombre
    } y quiero agendar una cita para la propiedad "${this.propiedad.clave}".

📅 Fecha: ${this.cita.fecha}
⏰ Hora: ${this.cita.hora}
📧 Correo: ${this.cita.email}
📝 Mensaje: ${this.cita.mensaje || 'Ninguno'}
    `);

    return `https://wa.me/52${this.propiedad.agente?.telefono}?text=${mensaje}`;
  }

  abrirMailto() {
    if (this.citaValida) {
      const mailto = this.generarMailto();
      window.open(mailto, '_blank');
    }
  }

  abrirWhatsApp() {
    if (this.citaValida) {
      const wa = this.generarWhatsAppLink();
      window.open(wa, '_blank');
    }
  }

  abrirFecha(event: any) {
    event.target.showPicker?.();
  }

  abrirHora(event: any) {
    event.target.showPicker?.();
  }

  validarHora() {
    if (!this.cita.fecha || !this.cita.hora) return;

    const ahora = new Date();
    const fechaSeleccionada = new Date(`${this.cita.fecha}T${this.cita.hora}`);
    const hoyStr = ahora.toISOString().split('T')[0];
    const esHoy = this.cita.fecha === hoyStr;

    if (esHoy) {
      const hora = ahora.getHours().toString().padStart(2, '0');
      const minutos = ahora.getMinutes().toString().padStart(2, '0');
      this.minHora = `${hora}:${minutos}`;
    } else {
      this.minHora = '00:00';
    }

    if (fechaSeleccionada < ahora) {
      this.cita.hora = '';
      setTimeout(() => {
        this.alertaService.mostrar(
          'No puedes seleccionar una hora anterior a la actual.',
          'warning'
        );
      }, 10);
    }
  }
}
