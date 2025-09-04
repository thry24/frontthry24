import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil-asesor',
  templateUrl: './perfil-asesor.page.html',
  styleUrls: ['./perfil-asesor.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PerfilAsesorPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
