import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { ColaboracionService } from 'src/app/services/colaboracion.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-colaboraciones',
  templateUrl: './colaboraciones.page.html',
  styleUrls: ['./colaboraciones.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class ColaboracionesPage implements OnInit {
  colaboraciones: any[] = [];
  usuarioActual: any = JSON.parse(localStorage.getItem('user') || '{}');
  mostrarModal = false;
  nuevaColaboracion: any = {};

  agentesInmobiliaria: any[] = [];
  agentesExternos: any[] = [];
  propiedades: any[] = [];

  constructor(
    private colabSrv: ColaboracionService,
    private http: HttpClient,
    private propiedadSrv: PropiedadService,
    private auth: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cargarColaboraciones();
  }

  // ================== CARGAR COLABORACIONES ==================
  cargarColaboraciones() {
    const email = this.usuarioActual?.email?.toLowerCase();
    if (!email) return;
    this.colabSrv.obtenerPorAgente(email).subscribe({
      next: (res) => (this.colaboraciones = res || []),
      error: (err) => console.error('Error al cargar colaboraciones:', err),
    });
  }

  // ================== ABRIR MODAL ==================
abrirModal() {
  this.nuevaColaboracion = {
    tipoColaboracion: '',
    colaboradorEmail: '',
    nombreColaborador: '',
    propiedadId: '',
    tipoOperacion: '',
    comision: 0,
    nota: '',
    seguimientoActivo: false,
    propiedadElegida: false,
  };
  this.mostrarModal = true;

  // 🔹 Siempre carga tus propiedades al abrir el modal
  this.cargarPropiedades();
}


  cerrarModal() {
    this.mostrarModal = false;
  }

  // ================== CAMBIO DE TIPO DE COLABORACIÓN ==================
async onTipoColaboracionChange() {
  const tipo = this.nuevaColaboracion.tipoColaboracion;
  this.agentesInmobiliaria = [];
  this.agentesExternos = [];
  this.propiedades = [];

  if (tipo === 'inmobiliaria') {
    await this.cargarAgentesInmobiliaria();
  } else if (tipo === 'externo') {
    await this.cargarAgentesExternos();
  }

  // 🔹 Y recarga tus propiedades también aquí
  this.cargarPropiedades();
}


  // ================== AGENTES DE LA INMOBILIARIA ==================
cargarAgentesInmobiliaria() {
  return new Promise<void>((resolve) => {
    const inmobiliariaId = this.usuarioActual?.inmobiliaria?._id || this.usuarioActual?.inmobiliaria;
    if (!inmobiliariaId) {
      console.warn('No pertenece a ninguna inmobiliaria');
      resolve();
      return;
    }

    this.http
      .get<any[]>(`${environment.apiUrl}/users?inmobiliaria=${inmobiliariaId}`)
      .subscribe(
        (res) => {
          this.agentesInmobiliaria = res.filter((u) => u.correo !== this.usuarioActual.email);
          resolve();
        },
        (err) => {
          console.error('Error al cargar agentes de inmobiliaria:', err);
          resolve();
        }
      );
  });
}

onColaboradorSeleccionado(email: string) {
  console.log('👤 Colaborador seleccionado:', email);
  this.nuevaColaboracion.colaboradorEmail = email;
  this.cargarPropiedades();
}


  // ================== AGENTES EXTERNOS (MENSAJES) ==================
// ================== AGENTES EXTERNOS (MENSAJES) ==================
cargarAgentesExternos() {
  return new Promise<void>((resolve) => {
    const token = this.auth.obtenerToken();
    if (!token) {
      console.warn('Token no disponible');
      resolve();
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    this.http.get<any[]>(`${environment.apiUrl}/mensajes-agentes`, { headers }).subscribe(
      (res) => {
        const miNombre = this.usuarioActual?.nombre?.trim()?.toLowerCase();

        // Creamos una lista de objetos con nombre y correo real
        const lista = res
          .map((m) => {
            const agente = m.nombreAgente?.trim();
            const cliente = m.nombreCliente?.trim();
            const emailAgente = m.emailAgente?.trim();
            const emailCliente = m.emailCliente?.trim();

            // Si el usuario actual es el agente, mostramos el cliente
            if (miNombre === agente?.toLowerCase()) {
              return {
                nombre: cliente,
                correo: emailCliente || `${cliente?.toLowerCase().replace(/ /g, '')}@externo.com`,
              };
            }

            // Si el usuario actual es el cliente, mostramos el agente
            if (miNombre === cliente?.toLowerCase()) {
              return {
                nombre: agente,
                correo: emailAgente || `${agente?.toLowerCase().replace(/ /g, '')}@externo.com`,
              };
            }

            return null;
          })
          .filter((v): v is { nombre: string; correo: string } => !!v);

        // Eliminamos duplicados por correo
        const correosUnicos = new Map<string, { nombre: string; correo: string }>();
        for (const item of lista) {
          if (!correosUnicos.has(item.correo)) {
            correosUnicos.set(item.correo, item);
          }
        }

        this.agentesExternos = Array.from(correosUnicos.values());
        console.log('✅ Agentes externos cargados:', this.agentesExternos);
        resolve();
      },
      (err) => {
        console.error('Error al cargar agentes externos:', err);
        resolve();
      }
    );
  });
}

onColaboradorExternoSeleccionado(email: string) {
  const externo = this.agentesExternos.find((a) => a.correo === email);
  if (!externo) return;

  const token = this.auth.obtenerToken();
  const headers = { Authorization: `Bearer ${token}` };

  // Guardamos nombre tentativo mientras se busca el correo real
  this.nuevaColaboracion.nombreColaborador = externo.nombre;
  this.nuevaColaboracion.colaboradorEmail = externo.correo;

  console.log('🔍 Buscando correo real del colaborador:', externo.nombre);

  // Llamamos al backend para intentar obtener el correo real del colaborador
this.http.get<any>(
  `${environment.apiUrl}/mensajes-agentes/agentes/buscar?nombre=${encodeURIComponent(externo.nombre)}`,{ headers }).subscribe({
      next: (res) => {
        if (res?.email) {
          this.nuevaColaboracion.colaboradorEmail = res.email;
          console.log('✅ Correo real encontrado:', res.email);
        } else {
          console.warn('⚠️ No se encontró correo real, se mantiene el externo:', externo.correo);
        }

        // Llamamos después de actualizar correo
        this.cargarPropiedades();
      },
      error: (err) => {
        console.error('Error al obtener correo real:', err);
        this.cargarPropiedades();
      },
    });
}



cargarPropiedades() {
  console.log('🚀 cargarPropiedades ejecutada');

  const miEmail = this.usuarioActual?.email || this.usuarioActual?.correo;
  const tipo = this.nuevaColaboracion.tipoColaboracion;
  const colaboradorEmail = this.nuevaColaboracion.colaboradorEmail;

  if (!miEmail) {
    console.warn('⚠️ usuarioActual sin correo:', this.usuarioActual);
    return;
  }

  console.log('📩 Cargando propiedades:', { miEmail, colaboradorEmail, tipo });

  const misProps$ = this.http.get<any[]>(
    `${environment.apiUrl}/propiedades/por-agente-email?agenteEmail=${miEmail}`
  );

  if (tipo === 'inmobiliaria' && colaboradorEmail) {
    const colabProps$ = this.http.get<any[]>(
      `${environment.apiUrl}/propiedades/por-agente-email?agenteEmail=${colaboradorEmail}`
    );

    forkJoin([misProps$, colabProps$]).subscribe({
      next: ([mias, colab]) => {
        console.log('📦 Mis props:', mias);
        console.log('📦 Colab props:', colab);
        this.propiedades = [
          ...(mias || []),
          ...(colab || []),
        ].filter((p) => p.estadoPublicacion?.toLowerCase() === 'publicada');
      },
      error: (err) => console.error('❌ Error al combinar propiedades:', err),
    });
  } else {
    misProps$.subscribe({
      next: (mias) => {
        console.log('📦 Mis propiedades:', mias);
        this.propiedades = (mias || []).filter(
          (p) => p.estadoPublicacion?.toLowerCase() === 'publicada'
        );
      },
      error: (err) => console.error('❌ Error cargando propiedades:', err),
    });
  }
}


  // ================== GUARDAR ==================
async guardarNuevaColaboracion() {
  const token = this.auth.obtenerToken();

  if (!token) {
    await this.mostrarAlerta('Sesión no válida', 'Por favor inicia sesión nuevamente.', 'warning');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  const data = {
    ...this.nuevaColaboracion,
    agenteEmail: this.usuarioActual.email,
    tipoOperacion: this.nuevaColaboracion.tipoOperacion?.toUpperCase(),
  };

  console.log('📤 Enviando colaboración:', data);

  this.http.post(`${environment.apiUrl}/colaboraciones`, data, { headers }).subscribe({
    next: async (res: any) => {
      await this.mostrarAlerta(
        '¡Colaboración guardada!',
        res.message || 'Colaboración creada correctamente 🎉',
        'success'
      );

      this.colaboraciones.unshift(res.colaboracion || res);
      this.mostrarModal = false;
    },
    error: async (err) => {
      console.error('❌ Error al crear colaboración:', err);

      let msg = 'Error al crear la colaboración.';
      if (err?.error?.message?.includes('seguimiento')) {
        msg = '⚠️ Ya existe un seguimiento entre este cliente y agente.';
      } else if (err?.error?.message) {
        msg = err.error.message;
      }

      await this.mostrarAlerta('Ups...', msg, 'error');
    },
  });
}

  // ================== VER DETALLES ==================
  async verDetalles(colaboracion: any) {
    const alert = await this.alertCtrl.create({
      header: 'Detalles de colaboración',
      message: `
        <b>Colaborador:</b> ${colaboracion.nombreColaborador || colaboracion.colaborador?.nombre}<br>
        <b>Tipo:</b> ${colaboracion.tipoColaboracion}<br>
        <b>Operación:</b> ${colaboracion.tipoOperacion}<br>
        <b>Comisión:</b> ${colaboracion.comision}%<br>
        <b>Estado:</b> ${colaboracion.estado}<br>
        <b>Seguimiento activo:</b> ${colaboracion.seguimientoActivo ? 'Sí' : 'No'}
      `,
      buttons: ['Cerrar'],
    });
    await alert.present();
  }
  async mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error' | 'warning' = 'success') {
  const colores = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
  };

  const alert = await this.alertCtrl.create({
    header: titulo,
    message: mensaje,
    buttons: ['OK'],
    mode: 'ios',
    cssClass: `alert-${tipo}`,
  });

  await alert.present();
}

}
