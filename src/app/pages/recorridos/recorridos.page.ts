import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { RecorridoService } from 'src/app/services/recorrido.service';

@Component({
  selector: 'app-recorridos',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './recorridos.page.html',
  styleUrls: ['./recorridos.page.scss']
})
export class RecorridosPage {
  recorridos: any[] = [];

  // 🔹 Listas dinámicas
  clientes: any[] = [];
  propiedades: any[] = [];

  // 🔹 Selecciones actuales
  clienteSeleccionado: any;
  propiedadSeleccionada: any;

  // 🔹 Control de formulario
  formularioAbierto = false;

  // 🔹 Objeto del nuevo recorrido
  nuevoRecorrido = {
    fecha: '',
    tipo: '',
    asesor: '',
    direccion: '',
    comision: 0,
    confirmado: false,
    nota: '',
    elegida: false,
    imagen: ''
  };

  constructor(
    private toast: ToastController,
    private authSrv: AuthService,
    private seguimientoSrv: SeguimientoService,
    private propiedadSrv: PropiedadService,
    private recorridoSrv: RecorridoService
  ) {}

  /* ===================== INICIO ===================== */
  async ngOnInit() {
    this.cargarClientes();
    this.cargarRecorridos(); 
  }

  /* ===================== CARGA DE CLIENTES ===================== */
  cargarClientes() {
    const usuario = this.authSrv.obtenerUsuario();

    if (!usuario?.email && !usuario?.correo) {
      console.warn('⚠️ No hay usuario autenticado');
      return;
    }

    const email = (usuario.email || usuario.correo).toLowerCase();

    this.seguimientoSrv.obtenerPorAgente(email).subscribe({
      next: (res) => {
        this.clientes = (res || []).filter((s: any) => s.clienteEmail);
        console.log('✅ Clientes cargados:', this.clientes);
      },
      error: (err) => {
        console.error('❌ Error cargando clientes:', err);
        this.toastMsg('Error al cargar clientes');
      }
    });
  }

  /* ===================== CLIENTE → PROPIEDAD ===================== */
  onClienteChange() {
    this.propiedades = [];
    this.propiedadSeleccionada = null;

    const propiedadId = this.clienteSeleccionado?.propiedadId;
    if (!propiedadId) return;

    this.propiedadSrv.obtenerPropiedadPorId(propiedadId).subscribe({
      next: (p: any) => {
        this.propiedades = [p];
        this.propiedadSeleccionada = p;
        console.log('✅ Propiedad cargada:', p);

        // 🔹 Rellenar automáticamente los campos del formulario
        this.nuevoRecorrido.direccion = p?.direccion?.colonia
          ? `${p.direccion.colonia}, ${p.direccion.municipio}, ${p.direccion.estado}`
          : p?.direccion || '';

        this.nuevoRecorrido.tipo = p?.tipoPropiedad || '';

        // ⚡ Aquí está el truco: si comision es objeto o número
        if (typeof p?.comision === 'object') {
          this.nuevoRecorrido.comision = p.comision.porcentaje || 0;
        } else {
          this.nuevoRecorrido.comision = p?.comision || 0;
        }

        // Si quieres mostrar si comparte comisión, podrías añadir una nota
        if (p?.comision?.comparte) {
          this.nuevoRecorrido.nota = 'Propiedad en colaboración';
        }

        this.nuevoRecorrido.asesor = this.authSrv.obtenerUsuario()?.nombre || 'Sin asesor';
      },
      error: (err) => {
        console.error('❌ Error cargando propiedad:', err);
        this.toastMsg('Error al cargar la propiedad asociada');
      }
    });
  }


  /* ===================== FORMULARIO ===================== */
  abrirFormulario() {
    this.formularioAbierto = true;
  }

  cerrarFormulario() {
    this.formularioAbierto = false;
  }

  /* ===================== GUARDAR ===================== */
guardarRecorrido() {
  if (!this.clienteSeleccionado || !this.propiedadSeleccionada) {
    this.toastMsg('Selecciona cliente y propiedad antes de guardar');
    return;
  }

  const nuevo = {
    ...this.nuevoRecorrido,
    fecha: new Date(this.nuevoRecorrido.fecha || new Date()),
    nombreCliente:
      this.clienteSeleccionado?.clienteNombre ||
      this.clienteSeleccionado?.nombre ||
      'Sin nombre',
    clienteEmail: this.clienteSeleccionado?.clienteEmail || '',
    agenteEmail: this.authSrv.obtenerUsuario()?.email || this.authSrv.obtenerUsuario()?.correo || '',
    propiedadId: this.propiedadSeleccionada?._id || '',
    clavePropiedad: this.propiedadSeleccionada?.clave || 'Sin clave', // ✅ nuevo
    seguimientoId: this.clienteSeleccionado?._id || '',
    direccion:
      this.propiedadSeleccionada?.direccion?.colonia
        ? `${this.propiedadSeleccionada.direccion.colonia}, ${this.propiedadSeleccionada.direccion.municipio}, ${this.propiedadSeleccionada.direccion.estado}`
        : this.propiedadSeleccionada?.direccion || '',
    tipo: this.propiedadSeleccionada?.tipoPropiedad || '',
    asesor: this.authSrv.obtenerUsuario()?.nombre || 'Sin asesor',
    imagen: this.propiedadSeleccionada?.imagenPrincipal || ''
  };

  this.recorridoSrv.crearRecorrido(nuevo).subscribe({
    next: (res: any) => {
      this.recorridos.unshift(res.recorrido);
      this.cerrarFormulario();
      this.resetFormulario();
      this.toastMsg('✅ Recorrido guardado correctamente');
    },
    error: (err) => {
      console.error('❌ Error al guardar recorrido:', err);
      this.toastMsg('Error al guardar recorrido en el servidor');
    }
  });
}

cargarRecorridos() {
  const usuario = this.authSrv.obtenerUsuario();

  if (!usuario?.email && !usuario?.correo) {
    console.warn('⚠️ No hay usuario autenticado');
    return;
  }

  const email = (usuario.email || usuario.correo).toLowerCase();

  this.recorridoSrv.obtenerPorAgente(email).subscribe({
    next: (res) => {
      this.recorridos = res || [];
      console.log('📋 Recorridos cargados:', this.recorridos);
    },
    error: (err) => {
      console.error('❌ Error cargando recorridos:', err);
      this.toastMsg('Error al cargar los recorridos');
    }
  });
}

  resetFormulario() {
    this.nuevoRecorrido = {
      fecha: '',
      tipo: '',
      asesor: '',
      direccion: '',
      comision: 0,
      confirmado: false,
      nota: '',
      elegida: false,
      imagen: ''
    };
  }

  /* ===================== UTIL ===================== */
  private async toastMsg(message: string) {
    const t = await this.toast.create({ message, duration: 1600, position: 'bottom' });
    await t.present();
  }
}
