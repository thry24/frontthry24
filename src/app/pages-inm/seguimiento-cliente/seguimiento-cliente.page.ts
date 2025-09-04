import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-seguimiento-cliente',
  templateUrl: './seguimiento-cliente.page.html',
  styleUrls: ['./seguimiento-cliente.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SeguimientoClientePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
