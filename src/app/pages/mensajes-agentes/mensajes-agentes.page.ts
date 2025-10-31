import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mensajes-agentes',
  templateUrl: './mensajes-agentes.page.html',
  styleUrls: ['./mensajes-agentes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MensajesAgentesPage {
  mensajesAgentes: any[] = [];
  mensajeSeleccionado: any;
  mostrarModalNota = false;
  nuevaNota = '';
  usuarioActual: any;
  asesores: string[] = ['Erika Kanafany', 'Jessica Thompson', 'Carlos Méndez'];

  // Redactar / responder
  mostrarModalRedactar = false;
  agentesDisponibles: any[] = [];
  agenteDestino: any = null;
  nuevoMensajeTexto = '';
  mostrandoResponder = false;
  textoRespuesta = '';

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.usuarioActual = this.auth.obtenerUsuario();
    this.obtenerMensajes();
  }

  // ================== OBTENER MENSAJES ==================
  obtenerMensajes() {
    const token = this.auth.obtenerToken();
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };
    this.http.get(`${environment.apiUrl}/mensajes-agentes`, { headers }).subscribe({
      next: (res: any) => (this.mensajesAgentes = res || []),
      error: (err) => {
        console.error('Error al obtener mensajes:', err);
        if (err.status === 403) alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      }
    });
  }
  

  // ================== SELECCIONAR MENSAJE ==================
  seleccionarMensaje(mensaje: any) {
    this.mensajeSeleccionado = mensaje;
  }

  // ================== NOMBRE MOSTRADO ==================
  obtenerNombreConversacion(mensaje: any): string {
    const miNombre = this.usuarioActual?.nombre?.trim()?.toLowerCase();
    const nombreAgente = mensaje.nombreAgente?.trim()?.toLowerCase();
    const nombreCliente = mensaje.nombreCliente?.trim()?.toLowerCase();

    // si soy el agente, muestra el cliente; si soy el cliente, muestra el agente
    if (miNombre === nombreAgente) return mensaje.nombreCliente;
    if (miNombre === nombreCliente) return mensaje.nombreAgente;
    return mensaje.nombreAgente || 'Desconocido';
  }

  // ================== NOTAS ==================
  abrirModalNota() { this.mostrarModalNota = true; }
  cerrarModalNota() { this.mostrarModalNota = false; }

  guardarNota() {
    if (!this.nuevaNota) return;
    this.mensajeSeleccionado.notas = this.mensajeSeleccionado.notas || [];
    this.mensajeSeleccionado.notas.push(this.nuevaNota);

    const token = this.auth.obtenerToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http.put(`${environment.apiUrl}/mensajes-agentes/${this.mensajeSeleccionado._id}`, this.mensajeSeleccionado, { headers })
      .subscribe(() => {
        alert('Nota guardada correctamente');
        this.cerrarModalNota();
      });
  }

  // ================== RESPONDER ==================
  abrirResponder() {
    this.mostrandoResponder = true;
  }

  cancelarRespuesta() {
    this.mostrandoResponder = false;
    this.textoRespuesta = '';
  }

  enviarRespuesta() {
    if (!this.textoRespuesta.trim()) return alert('Escribe un mensaje antes de enviar.');

    const token = this.auth.obtenerToken();
    const headers = { Authorization: `Bearer ${token}` };

    const miNombre = this.usuarioActual?.nombre?.trim()?.toLowerCase();
    const soyAgente = miNombre === this.mensajeSeleccionado.nombreAgente?.trim()?.toLowerCase();

    // El receptor será el otro participante
    const receptor = soyAgente
      ? this.mensajeSeleccionado.nombreCliente
      : this.mensajeSeleccionado.nombreAgente;

    const body = {
      nombreAgente: soyAgente ? this.usuarioActual.nombre : receptor,
      nombreCliente: soyAgente ? receptor : this.usuarioActual.nombre,
      texto: this.textoRespuesta,
      mensajeOriginalId: this.mensajeSeleccionado._id
    };

    this.http.post(`${environment.apiUrl}/mensajes-agentes`, body, { headers }).subscribe({
      next: () => {
        alert('Respuesta enviada correctamente');
        this.textoRespuesta = '';
        this.mostrandoResponder = false;
        this.obtenerMensajes();
      },
      error: (err) => {
        console.error('Error al enviar respuesta:', err);
        alert('Error al enviar respuesta.');
      }
    });
  }

  // ================== REDACTAR ==================
  abrirModalRedactar() {
    const miNombre = this.usuarioActual?.nombre?.trim()?.toLowerCase();

    // Tomar todas las personas con las que he conversado (sin duplicar)
    const lista = this.mensajesAgentes
      .map((m) => {
        const agente = m.nombreAgente?.trim();
        const cliente = m.nombreCliente?.trim();
        if (miNombre === agente?.toLowerCase()) return cliente;
        if (miNombre === cliente?.toLowerCase()) return agente;
        return null;
      })
      .filter((v): v is string => !!v);

    this.agentesDisponibles = [...new Set(lista)];
    this.mostrarModalRedactar = true;
  }

  cerrarModalRedactar() {
    this.mostrarModalRedactar = false;
    this.agenteDestino = null;
    this.nuevoMensajeTexto = '';
  }

  enviarMensajeNuevo() {
    if (!this.agenteDestino || !this.nuevoMensajeTexto.trim()) {
      alert('Selecciona un agente y escribe un mensaje.');
      return;
    }

    const token = this.auth.obtenerToken();
    const headers = { Authorization: `Bearer ${token}` };

    const miNombre = this.usuarioActual?.nombre?.trim()?.toLowerCase();
    const soyAgente = this.mensajesAgentes.some(
      (m) => m.nombreAgente?.trim()?.toLowerCase() === miNombre
    );

    const body = {
      nombreAgente: soyAgente ? this.usuarioActual.nombre : this.agenteDestino,
      nombreCliente: soyAgente ? this.agenteDestino : this.usuarioActual.nombre,
      texto: this.nuevoMensajeTexto,
    };

    this.http.post(`${environment.apiUrl}/mensajes-agentes`, body, { headers }).subscribe({
      next: () => {
        alert(`Mensaje enviado correctamente a ${this.agenteDestino}`);
        this.cerrarModalRedactar();
        this.obtenerMensajes();
      },
      error: (err) => {
        console.error('Error al enviar mensaje:', err);
        alert('Error al enviar mensaje.');
      }
    });
  }

  // ================== WHATSAPP ==================
  llamarWhatsApp() {
    if (!this.mensajeSeleccionado?.telefono) {
      alert('No hay número de teléfono disponible.');
      return;
    }

    const numero = this.mensajeSeleccionado.telefono.replace(/\D/g, '');
    const texto = encodeURIComponent(`Hola ${this.mensajeSeleccionado.nombreCliente}, te contacto desde Thry24.`);
    const url = `https://wa.me/${numero}?text=${texto}`;
    window.open(url, '_blank');
  }
  
}
