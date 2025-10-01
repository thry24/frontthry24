import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CrmLayoutComponent } from 'src/app/components/crm-layout/crm-layout.component';
import { ChatService, ChatMessage, ChatUser } from 'src/app/services/chat.service';
import { PropiedadService } from 'src/app/services/propiedad.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, CrmLayoutComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MensajesPage implements OnInit, OnDestroy {
  usuariosDisponibles: ChatUser[] = [];
  usuarioActual: any = JSON.parse(localStorage.getItem('user') || '{}');
  chatActivo: ChatUser | null = null;
  mensajes: ChatMessage[] = [];
  nuevoMensaje = '';
  archivoAdjunto: File | null = null;
  tipoDocumentoSeleccionado = '';
  mostrarClasificador = false;
  intervalMensajes: any = null;
  archivoSeleccionado: File | null = null;
  tipoDocumento = '';
  mostrarModalLink = false;
  enlaceACompartir = '';

  tiposDocumento: string[] = [
    'documentación cliente propietario',
    'documentación cliente comprador',
    'documentación cliente arrendatario',
    'carta oferta',
    'borrador contrato arrendamiento',
    'proyecto notaría',
    'recibo de pago comisión'
  ];

  constructor(
    private router: Router,
    private chat: ChatService,
    private propiedades: PropiedadService
  ) {}

  ngOnInit(): void {
    this.inicializarUsuario();
    this.inicializarSocket();
    this.cargarUsuarios();
  }

inicializarUsuario() {
  const userData = localStorage.getItem('user');
  if (userData) {
    const u = JSON.parse(userData);
    this.usuarioActual = { ...u, email: (u.email || u.correo || '').toLowerCase() };
  }
}

  inicializarSocket() {
    this.chat.conectarSocket(this.usuarioActual?.email);
    this.chat.onNuevoMensaje().subscribe((msg: ChatMessage) => {
      const me = (this.usuarioActual?.email || '').toLowerCase();
      const from = (msg.emisorEmail || '').toLowerCase();
      const to = (msg.receptorEmail || '').toLowerCase();
      const active = (this.chatActivo?.email || '').toLowerCase();
      if (to === me && active && from !== active) {
        this.chat.getThreads().subscribe(threads => {
          const lista = Array.isArray(threads) ? threads : [];
          lista.forEach(t => {
            const email = (t.email || '').toLowerCase();
            if (!email) return;
            const ya = this.usuariosDisponibles.some(u => (u.email || '').toLowerCase() === email);
            if (!ya) {
              this.usuariosDisponibles.push({
                _id: email,
                username: t.email,
                email: t.email,
                role: 'contacto',
                fotoPerfil: ''
              });
            }
          });
        });
      }
      if ((from === active && to === me) || (from === me && to === active)) {
        this.mensajes.push(msg);
        this.scrollToBottomSoon();
      }
    });
  }

  cargarUsuarios() {
    this.chat.getUsuarios().subscribe(usuarios => {
      const base = (Array.isArray(usuarios) ? usuarios : []).map((u: any) => ({
        ...u,
        email: u?.email || u?.correo || ''
      }));
      this.usuariosDisponibles = base.filter(
        u => u?.email && (u.email || '').toLowerCase() !== (this.usuarioActual.email || '').toLowerCase()
      );
    });
    this.chat.getThreads().subscribe(threads => {
  const lista = Array.isArray(threads) ? threads : [];
  const has = new Set(this.usuariosDisponibles.map(u => (u.email || '').toLowerCase()));
  lista.forEach((t: any) => {
    const email = (t.email || '').toLowerCase();
    if (!email || has.has(email)) return;
    this.usuariosDisponibles.push({
      _id: email,
      username: t.username || t.email,
      email: t.email,
      role: 'contacto',
      fotoPerfil: t.fotoPerfil || ''
    });
  });
});

  }

abrirChat(usuario: ChatUser) {
  this.chatActivo = { ...usuario, email: (usuario.email || '').toLowerCase() };
  this.cargarMensajes();
  if (this.intervalMensajes) clearInterval(this.intervalMensajes);
  this.intervalMensajes = setInterval(() => this.cargarMensajes(true), 3000);
}
  cargarMensajes(silencioso = false) {
    if (!this.chatActivo) return;
    this.chat.getMensajes(this.usuarioActual.email, this.chatActivo.email).subscribe((mensajes: ChatMessage[]) => {
      this.mensajes = mensajes;
      mensajes
        .filter(
          m =>
            (m.receptorEmail || '').toLowerCase() === (this.usuarioActual.email || '').toLowerCase() && !m.leido
        )
        .forEach(m => m._id && this.chat.marcarLeido(m._id, true).subscribe());
      if (!silencioso) this.scrollToBottomSoon();
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() && !this.archivoSeleccionado) return;
    if (!this.chatActivo) return;
    this.chat
      .enviarMensaje({
        emisorEmail: this.usuarioActual.email,
        receptorEmail: this.chatActivo.email,
        mensaje: this.nuevoMensaje || '',
        archivo: this.archivoSeleccionado || undefined,
        tipoDocumento: this.tipoDocumento || undefined,
        nombreCliente: this.chatActivo?.username || 'cliente'
      })
      .subscribe(res => {
        const doc = (res && res.mensaje) ? res.mensaje : null;
        this.mensajes.push(
          doc
            ? doc
            : ({
                emisorEmail: this.usuarioActual.email,
                receptorEmail: this.chatActivo!.email,
                mensaje: this.nuevoMensaje,
                archivoUrl: (res as any)?.archivoUrl || null,
                tipoDocumento: this.tipoDocumento || null,
                fecha: new Date()
              } as ChatMessage)
        );
        this.nuevoMensaje = '';
        this.archivoSeleccionado = null;
        this.tipoDocumento = '';
        this.scrollToBottomSoon();
      });
  }

  abrirModalLink() {
    this.enlaceACompartir = '';
    this.mostrarModalLink = true;
  }

  cerrarModalLink() {
    this.mostrarModalLink = false;
  }

  enviarLink() {
    if (!this.enlaceACompartir.trim() || !this.chatActivo) return;
    const mensajeLink = `<a href="${this.enlaceACompartir}" target="_blank">propuesta-ai24</a>`;
    this.chat
      .enviarMensaje({
        emisorEmail: this.usuarioActual.email,
        receptorEmail: this.chatActivo.email,
        mensaje: mensajeLink
      })
      .subscribe(() => {
        this.mensajes.push({
          emisorEmail: this.usuarioActual.email,
          receptorEmail: this.chatActivo!.email,
          mensaje: mensajeLink,
          fecha: new Date()
        } as ChatMessage);
        this.cerrarModalLink();
        this.scrollToBottomSoon();
      });
  }

  esPropuestaPropiedades(mensaje: string): boolean {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(mensaje, 'text/html');
      const enlace = doc.querySelector('a');
      return !!enlace && mensaje.includes('propuesta-ai24');
    } catch {
      return false;
    }
  }

  obtenerUrlPropuesta(mensaje: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(mensaje, 'text/html');
    const enlace = doc.querySelector('a');
    return enlace ? enlace.getAttribute('href') || '' : '';
  }

  onArchivoSeleccionado(event: any) {
    const file = event.target.files[0];
    if (file) this.archivoSeleccionado = file;
  }

  seleccionarArchivo(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.archivoAdjunto = archivo;
      this.mostrarClasificador = true;
    }
  }

  formatearHora(fecha: string | Date | undefined): string {
    if (!fecha) return '';
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  llamarWhatsApp() {
    const numero = (this.chatActivo as any)?.telefono;
    if (numero) {
      const numeroFormateado = '52' + numero.replace(/\D/g, '');
      window.open(`https://wa.me/${numeroFormateado}`, '_blank');
    } else {
      alert('No se encontró número de WhatsApp para este asesor.');
    }
  }

  private scrollToBottomSoon() {
    setTimeout(() => {
      const contenedor = document.querySelector('.chat-body') as HTMLElement | null;
      if (contenedor) contenedor.scrollTop = contenedor.scrollHeight;
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.intervalMensajes) clearInterval(this.intervalMensajes);
    this.chat.desconectarSocket();
  }
}
