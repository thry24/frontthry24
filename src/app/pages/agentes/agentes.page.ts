import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { MensajesPage } from '../mensajes/mensajes.page';
import { LoadingComponent } from 'src/app/components/loading/loading.component'; 

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.page.html',
  styleUrls: ['./agentes.page.scss'],
    imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponent,
    FooterComponent,
    MensajesPage,
    LoadingComponent
  ]
})
export class AgentesPage implements OnInit {
  vistaActiva: 'directorio' | 'mensajes' | 'favoritos' = 'directorio';
  agentes: any[] = [];
  favoritos: any[] = [];
  cargandoAgentes = true;
  busqueda = '';
  usuarioActual = JSON.parse(localStorage.getItem('user') || '{}');
  agenteChat: any = null;
  mensajes: any[] = [];
  nuevoMensaje = '';
  constructor(
    private chatSrv: ChatService,
    private wishlistSrv: WishlistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarAgentes();
    this.cargarFavoritos();
  }

cargarAgentes() {
  this.cargandoAgentes = true;
  this.chatSrv.getAgentes().subscribe({
    next: (res) => {
      this.agentes = (res || []).filter(
        u => u.correo !== this.usuarioActual?.correo // o correo según tu estructura
      );
      this.cargandoAgentes = false;
    },
    error: () => (this.cargandoAgentes = false),
  });
}



  cargarFavoritos() {
    this.wishlistSrv.obtenerFavoritos().subscribe({
      next: (res) => (this.favoritos = res || []),
      error: (err) => {
        console.error('Error al obtener favoritos:', err);
        this.favoritos = [];
      },
    });
  }

  agregarAFavoritos(propiedadId: string) {
    this.wishlistSrv.agregarAFavoritos(propiedadId).subscribe({
      next: () => this.cargarFavoritos(),
      error: (err) => console.error('Error al agregar a favoritos:', err),
    });
  }

  eliminarDeFavoritos(propiedadId: string) {
    this.wishlistSrv.eliminarDeFavoritos(propiedadId).subscribe({
      next: () => this.cargarFavoritos(),
      error: (err) => console.error('Error al eliminar favorito:', err),
    });
  }

  verPropiedadesAgente(agente: any) {
    this.router.navigate(['/propiedades'], {
      queryParams: { agenteEmail: agente.email },
    });
  }
  
iniciarChat(agente: any) {
  this.agenteChat = agente;
  this.vistaActiva = 'mensajes';

  this.chatSrv.getMensajes(this.usuarioActual.correo, agente.correo).subscribe({
    next: (res) => {
      this.mensajes = res || [];
    },
    error: (err) => console.error('Error al cargar mensajes:', err),
  });

  // escuchar mensajes nuevos
  this.chatSrv.conectarSocket(this.usuarioActual.correo);
  this.chatSrv.onNuevoMensaje().subscribe((msg) => {
    if (
      (msg.emisorEmail === this.usuarioActual.correo && msg.receptorEmail === this.agenteChat.correo) ||
      (msg.emisorEmail === this.agenteChat.correo && msg.receptorEmail === this.usuarioActual.correo)
    ) {
      this.mensajes.push(msg);
    }
  });
}

enviarMensaje() {
  if (!this.nuevoMensaje.trim()) return;

  const payload = {
    emisorEmail: this.usuarioActual.correo,
    receptorEmail: this.agenteChat.correo,
    mensaje: this.nuevoMensaje,
  };

  this.chatSrv.enviarMensaje(payload).subscribe({
    next: (res) => {
      this.mensajes.push(res);
      this.chatSrv.emitirNuevoMensaje(res);
      this.nuevoMensaje = '';
    },
    error: (err) => console.error('Error al enviar mensaje:', err),
  });
}
}
