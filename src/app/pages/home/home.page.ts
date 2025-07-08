import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  filtroSeleccionado: string = 'TODO';
  presupuestoMaximo: string = '';
  propiedades: any[] = [];
  constructor(private propiedadService: PropiedadService) {}

  ngOnInit() {
    // this.propiedadService.obtenerPropiedadesPublicadas().subscribe({
    //   next: (res: any) => {
    //     this.propiedades = res.propiedades || res;
    //   },
    //   error: (err) => {
    //     console.error('Error al obtener propiedades:', err);
    //   },
    // });
  }
  seleccionarFiltro(filtro: string) {
    this.filtroSeleccionado = filtro;
  }
  formatearPresupuesto(event: any): void {
    const valor = event.target.value.replace(/[^0-9]/g, '');
    const numero = parseInt(valor, 10);
    if (!isNaN(numero)) {
      this.presupuestoMaximo = '$' + numero.toLocaleString('es-MX');
    } else {
      this.presupuestoMaximo = '';
    }
  }
}
