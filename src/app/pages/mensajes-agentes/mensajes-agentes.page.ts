import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonIcon
} from '@ionic/angular';

@Component({
  selector: 'app-mensajes-agentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  templateUrl: './mensajes-agentes.page.html',
  styleUrls: ['./mensajes-agentes.page.scss']
})
export class MensajesAgentesPage {
  mensajesAgentes = [
    {
      nombreAgente: 'Erika Kanafany',
      texto: 'Hola, ¿sigue disponible la propiedad?',
      idPropiedad: 'ID123',
      imagenPropiedad: 'https://via.placeholder.com/100',
      fotoAgente: 'https://via.placeholder.com/40',
      fecha: new Date(),
      tituloPropiedad: 'Casa en el centro',
      tipoOperacion: 'Venta',
      precio: 1200000,
      ubicacion: 'Querétaro',
      nombreCliente: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '4421234567',
      estado: 'sin-atender',
      asignadoA: ''
    },
  ];

  mensajeSeleccionado: any = null;
  asesores = ['Erika Kanafany', 'Jessica Thompson', 'Carlos Méndez'];

  seleccionarMensaje(mensaje: any) {
    this.mensajeSeleccionado = mensaje;
  }

  llamarWhatsApp() {
    if (this.mensajeSeleccionado?.telefono) {
      window.open(`https://wa.me/52${this.mensajeSeleccionado.telefono}`, '_blank');
    }
  }
  mostrarModalNota = false;
nuevaNota: string = '';

abrirModalNota() {
  this.nuevaNota = this.mensajeSeleccionado?.nota || '';
  this.mostrarModalNota = true;
}

cerrarModalNota() {
  this.mostrarModalNota = false;
}

guardarNota() {
  if (this.mensajeSeleccionado) {
    this.mensajeSeleccionado.nota = this.nuevaNota;
  }
  this.mostrarModalNota = false;
}

}
