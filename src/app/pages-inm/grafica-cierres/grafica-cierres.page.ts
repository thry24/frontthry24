import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-grafica-cierres',
  templateUrl: './grafica-cierres.page.html',
  styleUrls: ['./grafica-cierres.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class GraficaCierresPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
