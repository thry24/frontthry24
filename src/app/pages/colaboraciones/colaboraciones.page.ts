import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonCheckbox,
  IonTextarea,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-colaboraciones',
  templateUrl: './colaboraciones.page.html',
  styleUrls: ['./colaboraciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonCheckbox,
    IonTextarea,
    IonIcon
  ]
})
export class ColaboracionesPage implements OnInit {
colaboraciones = [
  {
    fecha: '2025-07-01',
    asesor: 'Diego Sanz',
    colaborador: 'Inmobiliaria ABC',
    operacion: 'Venta',
    tipo: 'Cliente',
    registro: 'Rocio de la Peña',
    comision: '5%',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzzxU-jA2PF_c9ZjFu2cF0tzbX78C-zWQs8A&s',
    seguimiento: true,
    nota: '',
    propiedadElegida: false
  },
  {
    fecha: '2025-07-01',
    asesor: 'Diego Sanz',
    colaborador: 'Agente Independiente XYZ',
    operacion: 'Renta',
    tipo: 'Propiedad',
    registro: 'Juan Ramirez',
    comision: '3%',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-yPjM-uFxnm3Gmx7zKY_QNlyD9JvthlK7LA&s',
    seguimiento: true,
    nota: '',
    propiedadElegida: true
  }
];


  constructor() {}

  ngOnInit() {}

agregarColaboracion() {
  this.colaboraciones.push({
    fecha: '',
    asesor: '',
    colaborador: '',
    operacion: '',
    tipo: '',
    registro: '',
    comision: '',
    imagen: '',
    seguimiento: false,
    nota: '',
    propiedadElegida: false
  });
}

}
