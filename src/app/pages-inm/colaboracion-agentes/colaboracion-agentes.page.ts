import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-colaboracion-agentes',
  templateUrl: './colaboracion-agentes.page.html',
  styleUrls: ['./colaboracion-agentes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ColaboracionAgentesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
