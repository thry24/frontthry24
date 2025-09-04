import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-propiedad-seleccionada',
  templateUrl: './propiedad-seleccionada.page.html',
  styleUrls: ['./propiedad-seleccionada.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PropiedadSeleccionadaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
