import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-recorridos-programados',
  templateUrl: './recorridos-programados.page.html',
  styleUrls: ['./recorridos-programados.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RecorridosProgramadosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
