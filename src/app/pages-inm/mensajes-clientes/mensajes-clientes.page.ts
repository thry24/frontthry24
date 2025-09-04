import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-mensajes-clientes',
  templateUrl: './mensajes-clientes.page.html',
  styleUrls: ['./mensajes-clientes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MensajesClientesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
