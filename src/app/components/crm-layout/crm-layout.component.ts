import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ajusta la ruta según tu estructura

@Component({
  selector: 'app-crm-layout',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './crm-layout.component.html',
  styleUrls: ['./crm-layout.component.scss']
})
export class CrmLayoutComponent implements OnInit {
  nombreUsuario: string | null = null;
  rolUsuario: string | null = null;
  fotoPerfil: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLogged$.subscribe((estado) => {
      if (estado) {
        const user = this.authService.obtenerUsuario();
        this.nombreUsuario = user?.nombre || '';
        this.rolUsuario = user?.rol || '';
        this.fotoPerfil = user?.fotoPerfil || 'assets/default-avatar.png';
      } else {
        this.nombreUsuario = null;
        this.rolUsuario = null;
        this.fotoPerfil = null;
      }
    });

    try {
      const user = this.authService.obtenerUsuario();
      this.nombreUsuario = user?.nombre || '';
      this.rolUsuario = user?.rol || '';
      this.fotoPerfil = user?.fotoPerfil || 'assets/default-avatar.png';
    } catch (err) {
      console.error('Error obteniendo usuario en CRM layout:', err);
    }
  }
}
