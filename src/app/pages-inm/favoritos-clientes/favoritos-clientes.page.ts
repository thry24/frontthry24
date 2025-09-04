import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './favoritos-clientes.page.html',
  styleUrls: ['./favoritos-clientes.page.scss']
})
export class FavoritosClientesPage {
  propiedades = [
    {
      imagen: 'https://images.unsplash.com/photo-1560185008-b035f2b9b03b',
      titulo: 'Apartamento moderno',
      direccion: '2436 SW 8th St, Miami, FL 33135, USA',
      operacion: 'Renta',
      id: 'AI-2392332',
      precio: '$4,500/mo',
      tipo: 'Apartment'
    },
    {
      imagen: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      titulo: 'Casa moderna',
      direccion: 'Quincy St, Brooklyn, NY, USA',
      operacion: 'Renta',
      id: 'AI-2392332',
      precio: '$876,000<br>$7,600/sq ft',
      tipo: 'Apartment'
    },
    {
      imagen: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      titulo: 'Casa en Altozano',
      direccion: '8100 S Ashland Ave, Chicago, IL 60620, USA',
      operacion: 'Renta',
      id: 'AI-2392332',
      precio: '$11,000/mo',
      tipo: 'Apartment'
    }
  ];

  constructor(private toastController: ToastController) {}

  async programarRecorrido(propiedad: any) {
    const toast = await this.toastController.create({
      message: `🔔 Notificación enviada para programar recorrido de "${propiedad.titulo}"`,
      duration: 2500,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }
}
