import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertaService } from 'src/app/services/alerta.service';
import { PdfPropiedadService } from 'src/app/services/pdf-propiedad.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-mis-publicaciones',
  templateUrl: './mis-publicaciones.page.html',
  styleUrls: ['./mis-publicaciones.page.scss'],
  standalone: false,
})
export class MisPublicacionesPage implements OnInit {
  propiedades: any[] = [];
  propiedadesPaginadas: any[] = [];
  paginaActual = 1;
  itemsPorPagina = 5;

  currentUser: any = null;

  tiposLugares: string[] = [
    'restaurant',
    'school',
    'park',
    'bus_station',
    'hospital',
    'church',
  ];

  constructor(
    private propiedadService: PropiedadService,
    private router: Router,
    private alertController: AlertController,
    private alerta: AlertaService,
    private pdfSrv: PdfPropiedadService,
    private auth: AuthService,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.obtenerUsuario();
    this.cargarPropiedades();
  }

  get totalPaginas() {
    return Math.ceil(this.propiedades.length / this.itemsPorPagina);
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.propiedadesPaginadas = this.propiedades.slice(inicio, fin);
  }

  ngDoCheck() {
    this.actualizarPaginacion();
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  cargarPropiedades() {
    this.propiedadService.obtenerPropiedadesAgente().subscribe({
      next: (res: any) => (this.propiedades = res),
      error: (err) => console.error('Error al obtener propiedades:', err),
    });
  }

  editarPropiedad(propiedad: any) {
    this.router.navigate(['agente/editar-propiedad', propiedad._id]);
  }

  async eliminarPropiedad(propiedad: any) {
    const alert = await this.alertController.create({
      header: '¿Eliminar propiedad?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.propiedadService.eliminarPropiedad(propiedad._id).subscribe({
              next: () => {
                this.propiedades = this.propiedades.filter(
                  (p) => p._id !== propiedad._id
                );
                this.actualizarPaginacion();
              },
              error: (err) => console.error('Error al eliminar:', err),
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async cambiarEstadoPublicacion(propiedad: any) {
    const vaAPublicarse = propiedad.estadoPublicacion !== 'publicada';

    this.loading.mostrar();

    try {
      let body: any = {};
      if (vaAPublicarse) {
        const pdfBase64 = await this.generarPDFDePropiedad(propiedad, 'asesor');
        if (pdfBase64) body.pdfBase64 = pdfBase64;
      }

      this.propiedadService.publicarPropiedad(propiedad._id, body).subscribe({
        next: (res: any) => {
          propiedad.estadoPublicacion = res.propiedad.estadoPublicacion;
          this.loading.ocultar();
          this.alerta.mostrar(
            res.propiedad.estadoPublicacion === 'publicada'
              ? 'Propiedad publicada. Se envió el correo con el PDF.'
              : 'Propiedad marcada como no publicada.',
            'success'
          );
        },
        error: (err) => {
          console.error('Error al cambiar estado:', err);
          const mensaje =
            err?.error?.msg ||
            'Error inesperado al cambiar el estado de publicación.';
          this.alerta.mostrar(mensaje, 'warning');
          this.loading.ocultar();
        },
      });
    } catch (e) {
      console.error('Error preparando PDF:', e);
      this.alerta.mostrar(
        'No se pudo generar el PDF para el envío.',
        'warning'
      );
    }
  }

  private async generarPDFDePropiedad(
    propiedad: any,
    opcion: 'asesor' | 'usuario' | 'ninguno'
  ): Promise<string | null> {
    try {
      const rawAgente =
        propiedad?.agente && typeof propiedad.agente === 'object'
          ? propiedad.agente
          : this.currentUser || {};

      const agenteParaPDF = {
        nombre: rawAgente.nombre || rawAgente.fullName || 'Asesor',
        correo: rawAgente.correo || rawAgente.email || '',
        telefono: rawAgente.telefono || rawAgente.phone || '',
        fotoPerfil: rawAgente.fotoPerfil || null,
        logo: rawAgente.logo || null,
      };

      const imagenPrincipalBase64 =
        propiedad.imagenPrincipalBase64 ||
        (propiedad.imagenPrincipal
          ? await this.convertirImagenABase64(propiedad.imagenPrincipal)
          : '');

      const logoBase64 =
        agenteParaPDF.fotoPerfil || agenteParaPDF.logo
          ? await this.convertirImagenABase64(
              agenteParaPDF.fotoPerfil || (agenteParaPDF.logo as string)
            )
          : '';

      const mapaBase64 =
        propiedad.mapaBase64 ||
        (await this.pdfSrv.obtenerMapaBase64(
          propiedad.direccion?.lat,
          propiedad.direccion?.lng
        ));

      const logoAi24Base64 = await this.convertirImagenABase64(
        'assets/logo-ai24.jpeg'
      );

      const imagenesBase64 = await this.convertirImagenesABase64(
        propiedad.imagenes || []
      );

      const conteoLugares = await this.obtenerConteoLugares(
        propiedad.direccion?.lat,
        propiedad.direccion?.lng
      );

      const propiedadConBase64 = {
        ...propiedad,
        imagenPrincipalBase64,
        logoBase64,
        logoAi24Base64,
        imagenesBase64,
        mapaBase64,
        conteoLugares,
        agente: agenteParaPDF,
      };

      const base64 = await this.pdfSrv.generarPDF(
        propiedadConBase64,
        opcion,
        null
      );
      return base64 ?? null;
    } catch (err) {
      console.error('Error generando PDF:', err);
      return null;
    }
  }

  private convertirImagenABase64(url: string): Promise<string> {
    return new Promise((resolve) => {
      if (!url) return resolve('');
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = () => resolve('');
      img.src = url;
    });
  }

  private async convertirImagenesABase64(urls: string[]): Promise<string[]> {
    const arr: string[] = [];
    for (const u of urls) {
      arr.push(await this.convertirImagenABase64(u));
    }
    return arr.filter(Boolean);
  }

  private obtenerConteoLugares(
    lat?: number,
    lng?: number
  ): Promise<{ [key: string]: number }> {
    return new Promise((resolve) => {
      if (
        !lat ||
        !lng ||
        !(window as any).google ||
        !(window as any).google.maps ||
        !(window as any).google.maps.places
      ) {
        const vacio: { [key: string]: number } = {};
        this.tiposLugares.forEach((t) => (vacio[t] = 0));
        return resolve(vacio);
      }

      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      const tipos = this.tiposLugares;
      const conteo: { [key: string]: number } = {};
      let completados = 0;

      tipos.forEach((tipo: string) => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(lat, lng),
          radius: 500,
          type: tipo,
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            conteo[tipo] = results.length;
          } else {
            conteo[tipo] = 0;
          }

          completados++;
          if (completados === tipos.length) {
            resolve(conteo);
          }
        });
      });
    });
  }
}
