import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-directorio-agentes',
  templateUrl: './directorio-agentes.page.html',
  styleUrls: ['./directorio-agentes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DirectorioAgentesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
