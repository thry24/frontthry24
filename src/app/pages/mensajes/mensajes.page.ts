import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CrmLayoutComponent } from 'src/app/components/crm-layout/crm-layout.component';
import { ChatService, ChatMessage, ChatUser } from 'src/app/services/chat.service';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { AlertaService } from 'src/app/services/alerta.service';

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
    private propiedades: PropiedadService,
    private seguimientoSrv: SeguimientoService,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.inicializarUsuario();
    this.inicializarSocket();
    localStorage.setItem('user', JSON.stringify(this.usuarioActual));
    this.cargarUsuarios();
  }

  inicializarUsuario() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const u = JSON.parse(userData);
      this.usuarioActual = {
        ...u,
        email: (u.email || u.correo || '').toLowerCase(),
        tipoCliente: u.tipoCliente || null,
      };
    }
  }

  colorTipo(tipo: string): string {
  switch (tipo) {
    case 'comprador': return 'primary';
    case 'arrendatario': return 'warning';
    case 'propietario': return 'success';
    default: return 'medium';
  }
}


inicializarSocket() {
  this.chat.conectarSocket(this.usuarioActual?.email);

  this.chat.onNuevoMensaje().subscribe((msg: ChatMessage) => {
    const me = (this.usuarioActual?.email || '').toLowerCase();
    const from = (msg.emisorEmail || '').toLowerCase();
    const to = (msg.receptorEmail || '').toLowerCase();
    const active = (this.chatActivo?.email || '').toLowerCase();

    // 🔹 Si me llega mensaje de un nuevo contacto que no está activo en este momento
    if (to === me && active && from !== active) {
      this.chat.getThreads().subscribe(threads => {
        const lista = Array.isArray(threads) ? threads : [];

        lista.forEach(t => {
          const email = (t.email || '').toLowerCase();
          if (!email) return;

          const ya = this.usuariosDisponibles.some(
            u => (u.email || '').toLowerCase() === email
          );
          if (!ya) {
            // 🔹 Creamos el contacto con datos básicos
            const nuevoUsuario: any = {
              _id: email,
              username: t.username || t.email,
              email: t.email,
              tipoCliente: null,
              fotoPerfil: t.fotoPerfil || ''
            };

            // 🔹 Pedimos al backend su tipoCliente real (si existe relación)
            this.chat.getRelacion(t.email).subscribe({
              next: (res: any) => {
                nuevoUsuario.tipoCliente = res.relacion?.tipoCliente || null;
              },
              error: (err) => {
                console.warn('No se pudo obtener relación para', t.email, err);
                nuevoUsuario.tipoCliente = null;
              }
            });

            this.usuariosDisponibles.push(nuevoUsuario);
          }
        });
      });
    }

    // 🔹 Si el mensaje pertenece al chat activo
    if ((from === active && to === me) || (from === me && to === active)) {
      this.mensajes.push(msg);
      this.scrollToBottomSoon();
    }
  });
    // ✅ Evento socket: notificación de nuevo lead
  if (!this.alertaService) return; // evitar error si aún no está cargado

  this.chat.onNuevoLead().subscribe((data: any) => {
    console.log("🔥 Lead recibido!", data);

    // ✅ Solo notificamos si está dirigido a este agente
    const miEmail = (this.usuarioActual?.email || '').toLowerCase();
    const to = (data.agenteEmail || '').toLowerCase();
    if (to !== miEmail) return;

    // ✅ Mostrar alerta visual
    alert(`🔥 Nuevo Lead: ${data.clienteNombre} preguntó por ${data.propiedadClave}`);

    // ✅ Refrescar lista de usuarios
    this.cargarUsuarios();

    // ✅ Opcional: reproducir sonido 🎵
    const audio = new Audio('assets/sounds/notificacion.mp3');
    audio.play().catch(() => {});
  });

}


cargandoContactos = true; // 👈 Nueva variable
sinContactos = false; // 👈 Nueva variable

cargarUsuarios() {
  this.cargandoContactos = true;
  this.sinContactos = false;

  this.chat.getUsuarios().subscribe({
    next: async (usuarios) => {
      const base = (Array.isArray(usuarios) ? usuarios : []).map((u: any) => ({
        ...u,
        email: (u?.email || u?.correo || '').toLowerCase(),
        tipoCliente: null,
      }));

      // 🔹 Solo dejamos los que no son el usuario actual
      this.usuariosDisponibles = base.filter(
        (u) => u.email && u.email !== (this.usuarioActual.email || '').toLowerCase()
      );

      // 🔹 Cargar relaciones en paralelo
      await Promise.all(
        this.usuariosDisponibles.map(async (u) => {
          try {
            const res: any = await this.chat.getRelacion(u.email).toPromise();
            u.tipoCliente = res.relacion?.tipoCliente || null;
          } catch {
            u.tipoCliente = null;
          }
        })
      );

      // 🔹 Traer threads sin perder tipoCliente
      this.chat.getThreads().subscribe((threads) => {
        const lista = Array.isArray(threads) ? threads : [];
        const existentes = new Set(this.usuariosDisponibles.map((u) => u.email));

        lista.forEach((t: any) => {
          const email = (t.email || '').toLowerCase();
          if (!email || existentes.has(email)) return;
          this.usuariosDisponibles.push({
            _id: email,
            username: t.username || t.email,
            email: t.email,
            tipoCliente: null,
            fotoPerfil: t.fotoPerfil || '',
          });
        });

        this.cargandoContactos = false;
        this.sinContactos = this.usuariosDisponibles.length === 0;
      });
    },
    error: (err) => {
      console.error('Error al cargar usuarios:', err);
      this.cargandoContactos = false;
      this.sinContactos = true;
    },
  });
}



abrirChat(usuario: ChatUser) {
  this.chatActivo = { ...usuario, email: (usuario.email || '').toLowerCase() };

  // 🔹 Obtener relación y actualizar tanto chatActivo como usuariosDisponibles
  this.chat.getRelacion(this.chatActivo.email).subscribe({
    next: (res: any) => {
      const tipo = res.relacion?.tipoCliente || null;
      if (this.chatActivo) this.chatActivo.tipoCliente = tipo;

      // 🔹 Actualizamos también el usuario en la lista
      const index = this.usuariosDisponibles.findIndex(
        (u) => (u.email || '').toLowerCase() === this.chatActivo!.email.toLowerCase()
      );
      if (index !== -1) this.usuariosDisponibles[index].tipoCliente = tipo;
    },
    error: (err) => console.error('Error al obtener relación', err),
  });

  this.cargarMensajes();
  if (this.intervalMensajes) clearInterval(this.intervalMensajes);
  this.intervalMensajes = setInterval(() => this.cargarMensajes(true), 3000);
}


actualizarTipoCliente(usuario: any) {
  if (!usuario?.email || !usuario?.tipoCliente) return;

  this.chat.actualizarTipoCliente(usuario.email, usuario.tipoCliente).subscribe({
    next: (res: any) => {
      console.log('Tipo de cliente actualizado ✅', res.relacion.tipoCliente);
      this.chatActivo!.tipoCliente = res.relacion.tipoCliente;
    },
    error: (err) => console.error('Error al actualizar tipoCliente', err),
  });
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

generarSeguimiento(cliente: ChatUser) {
  const me = (this.usuarioActual?.email || '').toLowerCase();
  const ce = (cliente?.email || '').toLowerCase();

  this.seguimientoSrv.crearOObtenerSeguimiento({
    clienteEmail: ce,
    clienteNombre: cliente.username || '',
    agenteEmail: me,
    tipoCliente: cliente.tipoCliente || null, // 👈 aquí lo agregamos
    tipoOperacion: '',
    origen: 'mensajes'
  }).subscribe(seg => {
    localStorage.setItem('seguimientoCliente', JSON.stringify({
      id: seg._id,
      clienteEmail: seg.clienteEmail,
      agenteEmail: seg.agenteEmail,
      nombre: seg.clienteNombre || cliente.username || '',
      tipoCliente: seg.tipoCliente || cliente.tipoCliente || null, // 👈 lo guardamos también
    }));

    this.router.navigate(['/agente/seguimiento']);
  });
}


}
