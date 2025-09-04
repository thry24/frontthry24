import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-mensajes-asesores',
  templateUrl: './mensajes-asesores.page.html',
  styleUrls: ['./mensajes-asesores.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MensajesAsesoresPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
