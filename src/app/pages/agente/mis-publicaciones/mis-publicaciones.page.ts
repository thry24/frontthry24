import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertaService } from 'src/app/services/alerta.service';

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

  constructor(
    private propiedadService: PropiedadService,
    private router: Router,
    private alertController: AlertController,
    private alerta: AlertaService
  ) {}

  ngOnInit() {
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
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  cargarPropiedades() {
    this.propiedadService.obtenerPropiedadesAgente().subscribe({
      next: (res: any) => {
        this.propiedades = res;
      },
      error: (err) => {
        console.error('Error al obtener propiedades:', err);
      },
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
        {
          text: 'Cancelar',
          role: 'cancel',
        },
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
              error: (err) => {
                console.error('Error al eliminar:', err);
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  cambiarEstadoPublicacion(propiedad: any) {
    const nuevoEstado =
      propiedad.estadoPublicacion === 'publicada'
        ? 'no publicada'
        : 'publicada';
    this.propiedadService.publicarPropiedad(propiedad._id).subscribe({
      next: (res: any) => {
        propiedad.estadoPublicacion = res.propiedad.estadoPublicacion;
        this.alerta.mostrar(
          `Propiedad ${
            res.propiedad.estadoPublicacion === 'publicada'
              ? 'publicada'
              : 'marcada como no publicada'
          } correctamente.`,
          'success'
        );
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        const mensaje =
          err?.error?.msg ||
          'Error inesperado al cambiar el estado de publicación.';
        this.alerta.mostrar(mensaje, 'warning');
      },
    });
  }
}
