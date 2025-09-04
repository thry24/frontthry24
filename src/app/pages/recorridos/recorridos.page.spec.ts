import { Component } from '@angular/core';

@Component({
  selector: 'app-recorridos',
  templateUrl: './recorridos.page.html',
  styleUrls: ['./recorridos.page.scss']
})
export class RecorridosPage {
  recorridos = [
    {
      fecha: new Date(),
      nombreCliente: 'Diego Sanz',
      tipo: 'Casa',
      asesor: 'Externo',
      direccion: 'Av Constituyentes 73, Pte col. Casa Blanca, Querétaro',
      comision: 5,
      idPropiedad: 'CASQ73',
      confirmado: true,
      nota: 'espacio en blanco para que escriba el asesor',
      elegida: false
    },
    {
      fecha: new Date(),
      nombreCliente: 'Ana López',
      tipo: 'Departamento',
      asesor: 'Interno',
      direccion: 'Calle Reforma 123, Querétaro',
      comision: 3,
      idPropiedad: 'DEP123',
      confirmado: true,
      nota: 'espacio en blanco para que escriba el asesor',
      elegida: true
    }
  ];

  constructor() {}

  formatFecha(fecha: Date): string {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(fecha);
  }

  getIconoConfirmado(confirmado: boolean): string {
    return confirmado ? 'checkmark-outline' : 'close-outline';
  }

  getIconoElegida(elegida: boolean): string {
    return elegida ? 'checkmark-circle-outline' : 'close-circle-outline';
  }
}
