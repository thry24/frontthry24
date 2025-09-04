import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-crm-layout',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './crm-layout.component.html',
  styleUrls: ['./crm-layout.component.scss']
})
export class CrmLayoutComponent {
  nombreUsuario = 'Juan Pérez';
  rolUsuario = 'Agente Inmobiliario';
  fotoPerfil = 'https://randomuser.me/api/portraits/men/32.jpg';
}
