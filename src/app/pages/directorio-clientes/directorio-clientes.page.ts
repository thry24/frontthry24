import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-directorio-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './directorio-clientes.page.html',
  styleUrls: ['./directorio-clientes.page.scss'],
})
export class DirectorioClientesPage implements OnInit {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  searchTerm = '';
  tipoClienteFiltro = '';
  estadoFiltro = '';
  mostrarFormulario = false;

  nuevoCliente: any = {
    nombre: '',
    email: '',
    telefono: '',
    tipoCliente: '',
    tipoOperacion: '',
  };

  usuarioActual = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(private http: HttpClient, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.cargarClientesDinamicos();
  }

  /** 🔹 Obtiene clientes desde mensajes y relaciones */
  async cargarClientesDinamicos() {
    try {
      const agenteEmail = (this.usuarioActual.email || this.usuarioActual.correo || '').toLowerCase();
      const agenteId = this.usuarioActual._id;

      // 1️⃣ Obtener mensajes
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

const mensajes: any[] = await this.http
  .get<any[]>(`${environment.apiUrl}/mensajes/agente/${agenteEmail}`, { headers })
  .toPromise() || [];

      // 2️⃣ Obtener relaciones
const relaciones: any[] = await this.http
  .get<any[]>(`${environment.apiUrl}/relaciones/agente/${agenteId}`, { headers })
  .toPromise() || [];

      // 3️⃣ Normalizar mensajes → cliente
      const clientesMensajes = mensajes.map((m) => ({
        nombre: m.nombreCliente || m.emisorEmail,
        email:
          m.emisorEmail.toLowerCase() === agenteEmail
            ? m.receptorEmail
            : m.emisorEmail,
        telefono: m.telefono || '—',
        tipoCliente: 'mensaje',
        tipoOperacion: m.propiedadClave?.includes('REN') ? 'renta' : 'venta',
        fechaRegistro: m.fecha || m.createdAt,
        status: 'activo',
        origen: 'mensajes',
      }));

      // 4️⃣ Normalizar relaciones → cliente
      const clientesRelaciones = relaciones.map((r) => ({
        nombre: r.cliente?.nombre || 'Sin nombre',
        email: r.cliente?.correo || r.cliente?.email,
        telefono: r.cliente?.telefono || '—',
        tipoCliente: r.tipoCliente || '—',
        tipoOperacion: '',
        fechaRegistro: r.createdAt,
        status: 'activo',
        origen: 'relacion',
      }));

      // 5️⃣ Fusionar y eliminar duplicados
      const mapa = new Map<string, any>();
      [...clientesMensajes, ...clientesRelaciones].forEach((c) => {
        const key = (c.email || '').toLowerCase();
        if (key && !mapa.has(key)) mapa.set(key, c);
      });

      this.clientes = Array.from(mapa.values()).sort(
        (a, b) =>
          new Date(b.fechaRegistro).getTime() -
          new Date(a.fechaRegistro).getTime()
      );

      this.aplicarFiltros();
    } catch (err) {
      console.error('❌ Error cargando clientes dinámicos:', err);
      this.mostrarAlerta(
        'Error',
        'No se pudieron cargar los clientes dinámicos.',
        'error'
      );
    }
  }

  aplicarFiltros() {
    this.clientesFiltrados = this.clientes.filter((c) => {
      const s = this.searchTerm.toLowerCase();
      const matchSearch =
        !s ||
        c.nombre?.toLowerCase().includes(s) ||
        c.email?.toLowerCase().includes(s) ||
        c.telefono?.toLowerCase().includes(s);
      const matchTipo =
        !this.tipoClienteFiltro || c.tipoCliente === this.tipoClienteFiltro;
      const matchEstado =
        !this.estadoFiltro || (c.status || 'activo') === this.estadoFiltro;
      return matchSearch && matchTipo && matchEstado;
    });
  }

  onSearchChange() {
    this.aplicarFiltros();
  }
  onFiltroChange() {
    this.aplicarFiltros();
  }

  /** 🔹 Muestra formulario para nuevo cliente */
  abrirFormulario() {
    this.nuevoCliente = {
      nombre: '',
      email: '',
      telefono: '',
      tipoCliente: '',
      tipoOperacion: '',
    };
    this.mostrarFormulario = true;
  }

  /** 🔹 Guarda cliente manual (opcional, si usas tu API) */
  guardarCliente() {
    this.mostrarAlerta(
      'Guardado',
      'Función de guardar cliente aún no implementada (en modo dinámico).',
      'success'
    );
  }

  /** 🔹 Edita cliente */
  editarCliente(cliente: any) {
    this.nuevoCliente = { ...cliente };
    this.mostrarFormulario = true;
  }

  /** 🔹 Confirmación de borrado */
  async confirmarEliminacion(cliente: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Seguro que deseas eliminar a <b>${cliente.nombre}</b>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminarCliente(cliente.email),
        },
      ],
    });
    await alert.present();
  }

  eliminarCliente(email: string) {
    // Solo elimina localmente (porque en modo dinámico viene de mensajes)
    this.clientes = this.clientes.filter(
      (c) => c.email.toLowerCase() !== email.toLowerCase()
    );
    this.aplicarFiltros();
  }

  /** 🔹 Abre chat con el cliente seleccionado */
  abrirChatCon(cliente: any) {
    const data = {
      email: cliente.email,
      username: cliente.nombre,
      tipoCliente: cliente.tipoCliente,
    };
    localStorage.setItem('chatCliente', JSON.stringify(data));
    window.location.href = '/agente/mensajes';
  }

  /** 🔹 Alert reusable */
  async mostrarAlerta(
    titulo: string,
    mensaje: string,
    tipo: 'success' | 'error' | 'warning' = 'success'
  ) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      mode: 'ios',
    });
    await alert.present();
  }
}
