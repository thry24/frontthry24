import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CrmLayoutComponent } from 'src/app/components/crm-layout/crm-layout.component';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrmLayoutComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MensajesPage implements OnInit, OnDestroy {
  usuariosDisponibles: any[] = [];
  usuarioActual: any = JSON.parse(localStorage.getItem('user') || '{}');
  chatActivo: any = null;
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  archivoAdjunto: File | null = null;
  tipoDocumentoSeleccionado: string = '';
  mostrarClasificador: boolean = false;
  intervalMensajes: any = null;
  socket!: Socket;
  archivoSeleccionado: File | null = null;
  tipoDocumento: string = '';
  mostrarModalLink: boolean = false;
  enlaceACompartir: string = '';

  tiposDocumento: string[] = [
    'documentación cliente propietario',
    'documentación cliente comprador',
    'documentación cliente arrendatario',
    'carta oferta',
    'borrador contrato arrendamiento',
    'proyecto notaría',
    'recibo de pago comisión'
  ];


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.inicializarUsuario();
    this.inicializarSocket();
    this.cargarUsuarios();
  }

  inicializarUsuario() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.usuarioActual = JSON.parse(userData);
    }
  }

  inicializarSocket() {
    this.socket = io('http://localhost:5000');
    this.socket.on('nuevoMensaje', (msg: any) => {
      if (
        (msg.emisorEmail === this.chatActivo?.email && msg.receptorEmail === this.usuarioActual.email) ||
        (msg.emisorEmail === this.usuarioActual.email && msg.receptorEmail === this.chatActivo?.email)
      ) {
        this.mensajes.push(msg);
      }
    });
  }

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:5000/api/auth/users').subscribe(usuarios => {
      this.usuariosDisponibles = usuarios.filter(
        u => u.email !== this.usuarioActual.email
      );
    });
  }

  abrirChat(usuario: any) {
    this.chatActivo = usuario;
    this.cargarMensajes();

    if (this.intervalMensajes) clearInterval(this.intervalMensajes);

    this.intervalMensajes = setInterval(() => {
      this.cargarMensajes(true);
    }, 3000);

    this.http.get<any[]>(`http://localhost:5000/api/properties`).subscribe(propiedades => {
      const propiedadDelAsesor = propiedades.find(p => p.userId === usuario._id);
      if (propiedadDelAsesor) {
        this.chatActivo.telefono = propiedadDelAsesor.propietarioTelefono;
      }
    });
  }

  cargarMensajes(silencioso: boolean = false) {
    if (!this.chatActivo) return;

    this.http.get<any[]>(`http://localhost:5000/api/chat/${this.usuarioActual.email}/${this.chatActivo.email}`)
      .subscribe(mensajes => {
        this.mensajes = mensajes;

        const mensajesNoLeidos = mensajes.filter(
          m => m.receptorEmail === this.usuarioActual.email && !m.leido
        );

        mensajesNoLeidos.forEach(mensaje => {
          this.http.patch(`http://localhost:5000/api/chat/marcar-leido/${mensaje._id}`, { leido: true }).subscribe();
        });

        if (!silencioso) {
          setTimeout(() => {
            const contenedor = document.querySelector('.chat-body');
            if (contenedor) contenedor.scrollTop = contenedor.scrollHeight;
          }, 100);
        }
      });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() && !this.archivoSeleccionado) return;
    if (!this.chatActivo) return;

    const formData = new FormData();
    formData.append('emisorEmail', this.usuarioActual.email);
    formData.append('receptorEmail', this.chatActivo.email);
    formData.append('mensaje', this.nuevoMensaje || '');
    formData.append('nombreCliente', this.chatActivo?.username || 'cliente');

    if (this.archivoSeleccionado) {
      formData.append('archivo', this.archivoSeleccionado);
      formData.append('tipoDocumento', this.tipoDocumento || '');
    }

    this.http.post<any>('http://localhost:5000/api/chat/enviar', formData).subscribe(res => {
      this.mensajes.push({
        emisorEmail: this.usuarioActual.email,
        receptorEmail: this.chatActivo.email,
        mensaje: this.nuevoMensaje,
        archivoUrl: res?.archivoUrl || null,
        tipoDocumento: this.tipoDocumento,
        fecha: new Date()
      });

      this.nuevoMensaje = '';
      this.archivoSeleccionado = null;
      this.tipoDocumento = '';
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
  if (!this.enlaceACompartir.trim()) return;

  const mensajeLink = `<a href="${this.enlaceACompartir}" target="_blank">propuesta-ai24</a>`;

  this.http.post('http://localhost:5000/api/chat/enviar', {
    emisorEmail: this.usuarioActual.email,
    receptorEmail: this.chatActivo.email,
    mensaje: mensajeLink
  }).subscribe(() => {
    this.mensajes.push({
      emisorEmail: this.usuarioActual.email,
      receptorEmail: this.chatActivo.email,
      mensaje: mensajeLink,
      fecha: new Date()
    });

    this.cerrarModalLink();
  });
}


  // Verifica si el mensaje es una propuesta de propiedades (basado en que sea un <a> con URL)
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

// Extrae la URL de la propuesta
obtenerUrlPropuesta(mensaje: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(mensaje, 'text/html');
  const enlace = doc.querySelector('a');
  return enlace ? enlace.getAttribute('href') || '' : '';
}



  onArchivoSeleccionado(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  seleccionarArchivo(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.archivoAdjunto = archivo;
      this.mostrarClasificador = true;
    }
  }

  formatearHora(fecha: string): string {
    const hora = new Date(fecha);
    return hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  llamarWhatsApp() {
    const numero = this.chatActivo?.telefono;
    if (numero) {
      const numeroFormateado = '52' + numero.replace(/\D/g, '');
      const url = `https://wa.me/${numeroFormateado}`;
      window.open(url, '_blank');
    } else {
      alert('No se encontró número de WhatsApp para este asesor.');
    }
  }

  ngOnDestroy(): void {
    if (this.intervalMensajes) {
      clearInterval(this.intervalMensajes);
    }
  }
}
