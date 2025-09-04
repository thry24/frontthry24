import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recorridos',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
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
      nota: '',
      elegida: false,
      imagen: ''
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
      nota: '',
      elegida: true,
      imagen: ''
    }
  ];

  modalOpen = false;

  nuevoRecorrido = {
    fecha: '',
    nombreCliente: '',
    tipo: '',
    asesor: '',
    direccion: '',
    comision: 0, // <- debe ser un número, no null
    idPropiedad: '',
    confirmado: false,
    nota: '',
    elegida: false,
    imagen: ''
  };


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


abrirFormulario() {
  this.formularioAbierto = true;
}


  cerrarFormulario() {
    this.modalOpen = false;
  }

  guardarRecorrido() {
    const nuevo = {
      ...this.nuevoRecorrido,
      fecha: new Date(this.nuevoRecorrido.fecha || new Date())
    };

    this.recorridos.push(nuevo);
    this.cerrarFormulario();
    this.nuevoRecorrido = {
      fecha: '',
      nombreCliente: '',
      tipo: '',
      asesor: '',
      direccion: '',
      comision: 0,

      idPropiedad: '',
      confirmado: false,
      nota: '',
      elegida: false,
      imagen: ''
    };
  }
  formularioAbierto = false;

}
