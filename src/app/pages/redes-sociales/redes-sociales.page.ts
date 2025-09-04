import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-redes-sociales',
  templateUrl: './redes-sociales.page.html',
  styleUrls: ['./redes-sociales.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RedesSocialesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
