import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service'; // ✅ IMPORTAR
import { AlertaService } from '../../services/alerta.service'; // ✅ TOAST

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

  public nuevosLeads = 0;

  constructor(
    private authService: AuthService,
    private chat: ChatService,       // ✅ ESCUCHAR SOCKETS
    private alerta: AlertaService    // ✅ MOSTRAR AVISOS
  ) {}

  ngOnInit() {
    this.authService.isLogged$.subscribe((estado) => {
      if (estado) this.loadUser();
      else this.resetUser();
    });

    this.loadUser();
    this.listenForLeads(); // ✅ ACTIVAMOS ESCUCHA
  }

  private loadUser() {
    const user = this.authService.obtenerUsuario();
    this.nombreUsuario = user?.nombre || '';
    this.rolUsuario = user?.rol || '';
    this.fotoPerfil = user?.fotoPerfil || 'assets/default-avatar.png';
  }

  private resetUser() {
    this.nombreUsuario = null;
    this.rolUsuario = null;
    this.fotoPerfil = null;
  }
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // ✅ Escuchar evento desde socket.io
  private listenForLeads() {
    this.chat.onNuevoLead().subscribe((data: any) => {
      const me = this.authService.obtenerUsuario()?.correo?.toLowerCase();
      if (!me) return;

      // Solo si el lead es para este agente 👉 evitar notificaciones cruzadas
      if (data.agenteEmail?.toLowerCase() !== me) return;

      this.nuevosLeads++;

      // ✅ Notificación visual
      this.alerta.mostrar(
        `🔥 Nuevo lead: ${data.clienteNombre || data.clienteEmail}`,
        'success'
      );
    });
  }

  // ✅ Limpiar contador al entrar a Mensajes
  resetLeads() {
    this.nuevosLeads = 0;
  }
}
