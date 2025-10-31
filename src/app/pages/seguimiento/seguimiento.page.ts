import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { CitasService } from 'src/app/services/citas.service';
import { PropiedadService } from 'src/app/services/propiedad.service';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  templateUrl: './seguimiento.page.html',
  styleUrls: ['./seguimiento.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SeguimientoPage implements OnInit {
  mostrarLineaTiempo = true;
  idSeguimiento = '';
  tipoOperacionCliente: 'VENTA' | 'RENTA' | '' = '';
  estatusOperacionOpciones = [
    'No contesta',
    'En proceso',
    'Pendiente por confirmar cita',
    'Se decidió por otra opción',
    'Recorrido pendiente',
    'Otras',
  ];
  estatusSeleccionado = '';
  estatusOtraMotivo = '';
  tieneSeguimiento = true;
  seguimientos: any[] = [];
  seguimientoCliente: any = {};
  mostrarModalCita = false;
  horasDisponibles: string[] = [];
  horaSeleccionada = '';

  timelineVenta = [
    { paso: 'PRIMER CONTACTO', campo: 'fechaPrimerContacto', tipo: 'fecha' },
    { paso: 'ELECCIÓN DE PROPIEDADES', campo: 'fechaEleccion', tipo: 'fecha' },
    { paso: 'CITA CONCERTADA', campo: 'fechaCita', tipo: 'fecha' },
    { paso: 'RECORRIDO PROGRAMADO', campo: 'fechaRecorrido', tipo: 'fecha' },
    { paso: 'CARTA OFERTA', campo: 'fechaCarta', tipo: 'fecha' },
    { paso: 'DOCUMENTOS COMPLETOS', campo: 'docsCompletos', tipo: 'check' },
    { paso: 'ACEPTACIÓN', campo: 'fechaAceptacion', tipo: 'fecha' },
    { paso: 'NOTARÍA', campo: 'fechaNotaria', tipo: 'fecha' },
    { paso: 'BORRADOR', campo: 'fechaBorrador', tipo: 'fecha' },
    { paso: 'FIRMA', campo: 'fechaFirma', tipo: 'fecha' },
  ];

  timelineRenta = [
    { paso: 'PRIMER CONTACTO', campo: 'fechaPrimerContacto', tipo: 'fecha' },
    { paso: 'CITA CONCERTADA', campo: 'fechaCita', tipo: 'fecha' },
    { paso: 'CARTA OFERTA', campo: 'fechaCartaOferta', tipo: 'fecha' },
    { paso: 'DOCUMENTOS COMPLETOS', campo: 'documentosCompletos', tipo: 'check' },
    { paso: 'BORRADOR CONTRATO', campo: 'fechaBorradorArr', tipo: 'fecha' },
    { paso: 'FIRMA CONTRATO', campo: 'fechaFirmaArr', tipo: 'fecha' },
  ];

  constructor(private seguimientoSrv: SeguimientoService, private citasSrv: CitasService, private propiedadSrv: PropiedadService) {}

  ngOnInit(): void {
    const cache = localStorage.getItem('seguimientoCliente');
    if (!cache) {
      this.tieneSeguimiento = false;
      return;
    }

    const data = JSON.parse(cache);
    this.cargarSeguimientosAgente(data.agenteEmail);
  }

  onFechaCitaChange() {
    // solo si existe fechaCita
    const fecha = this.seguimientoCliente?.fechaCita;
    if (!fecha || !this.seguimientoCliente?.agenteEmail) return;

    // normaliza a "YYYY-MM-DD"
    const ymd = String(fecha).substring(0, 10);
    this.horaSeleccionada = '';
    this.citasSrv.getHorasDisponibles(this.seguimientoCliente.agenteEmail, ymd)
      .subscribe({
        next: (resp) => this.horasDisponibles = resp.horas,
        error: (e) => console.error('Horas disponibles error:', e)
      });
  }

  programarCita() {
    const fecha = this.seguimientoCliente?.fechaCita;
    if (!this.idSeguimiento || !fecha) {
      return alert('Selecciona una fecha primero');
    }
    this.mostrarModalCita = true;
  }

confirmarCita() {
  if (!this.horaSeleccionada) return alert('Selecciona una hora');

  const ymd = String(this.seguimientoCliente.fechaCita).substring(0, 10);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const data = {
    seguimientoId: this.idSeguimiento,
    agenteEmail: this.seguimientoCliente.agenteEmail,
    agenteNombre: usuario.nombre || "",

    clienteEmail: this.seguimientoCliente.clienteEmail,
    clienteNombre: this.seguimientoCliente.clienteNombre,
    tipoCliente: this.seguimientoCliente.tipoCliente || "Cliente directo",

    propiedadId: this.seguimientoCliente.propiedadId,
    propiedadClave: this.seguimientoCliente.propiedadClave || "",

    tipoOperacion: this.tipoOperacionCliente || "RENTA",
    tipoEvento: "Recorrido",

    fecha: ymd,
    hora: this.horaSeleccionada
  };

    this.citasSrv.crearCita(data).subscribe({
      next: () => {
        alert('✅ Cita agendada correctamente');

        // ✅ reflejar inmediatamente en la UI
        this.seguimientoCliente.fechaCita = data.fecha;

        // ✅ refrescar seguimientos para que BD y UI coincidan
        this.cargarSeguimientosAgente(this.seguimientoCliente.agenteEmail);

        this.mostrarModalCita = false;
        this.horaSeleccionada = '';
        
      },
      error: (e) => {
        console.error(e);
        alert(e?.error?.msg || 'No se pudo crear la cita');
      }
    });
  }

cerrarModal() {
  this.mostrarModalCita = false;
}

cargarHorasDisponibles() {
  const fecha = this.seguimientoCliente.fechaCita;
  if (!fecha) return;

  this.citasSrv.getHorasDisponibles(
    this.seguimientoCliente.agenteEmail,
    this.seguimientoCliente.fechaCita
  ).subscribe((resp) => {
    this.horasDisponibles = resp.horas;
  });
}



  cargarSeguimientosAgente(agenteEmail: string) {
    this.seguimientoSrv.obtenerPorAgente(agenteEmail).subscribe({
      next: (res) => {
        this.seguimientos = res || [];
        this.tieneSeguimiento = this.seguimientos.length > 0;
      },
      error: (err) => console.error('Error cargando seguimientos:', err),
    });
  }

  seleccionarSeguimientoPorId(id: string) {
    const seg = this.seguimientos.find(s => s._id === id);
    if (!seg) return;

    this.idSeguimiento = seg._id;
    this.seguimientoCliente = { ...seg };

    this.tipoOperacionCliente = seg.tipoOperacion || '';
    this.estatusSeleccionado = seg.estatus || 'En proceso';
    this.estatusOtraMotivo = seg.estatusOtraMotivo || '';

    const convertir = (v: any) => v ? v.substring(0, 10) : '';

    this.seguimientoCliente.fechaPrimerContacto = convertir(seg.fechaPrimerContacto);
    this.seguimientoCliente.fechaCita = convertir(seg.fechaCita);
    this.seguimientoCliente.fechaRecorrido = convertir(seg.fechaRecorrido);
    this.seguimientoCliente.fechaCarta = convertir(seg.fechaCarta);
    this.seguimientoCliente.fechaAceptacion = convertir(seg.fechaAceptacion);
    this.seguimientoCliente.fechaNotaria = convertir(seg.fechaNotaria);
    this.seguimientoCliente.fechaBorrador = convertir(seg.fechaBorrador);
    this.seguimientoCliente.fechaFirma = convertir(seg.fechaFirma);
    this.seguimientoCliente.fechaCartaOferta = convertir(seg.fechaCartaOferta);
    this.seguimientoCliente.fechaBorradorArr = convertir(seg.fechaBorradorArr);
    this.seguimientoCliente.fechaFirmaArr = convertir(seg.fechaFirmaArr);

    // ✅ CARGAR la propiedad asociada
    if (seg.propiedadId) {
      this.propiedadSrv.obtenerPropiedadPorId(seg.propiedadId)
        .subscribe((p: any) => {
          this.seguimientoCliente.propiedadClave = p.clave || "";
          this.seguimientoCliente.imgPropiedad = p.imagenPortada || p.imagenes?.[0] || "";
        });
    }
    
  }



  onCambiarTipoOperacion(tipo: 'VENTA' | 'RENTA' | ''): void {
    this.tipoOperacionCliente = tipo;
    if (this.idSeguimiento) {
      this.seguimientoSrv
        .actualizar(this.idSeguimiento, { tipoOperacion: tipo })
        .subscribe();
    }
  }

  guardarCambios(): void {
    if (!this.idSeguimiento) return;

    const s = this.seguimientoCliente;
    const toISO = (d: any) => (d ? new Date(d).toISOString() : null);

    const cambios: any = {
      tipoOperacion: this.tipoOperacionCliente,
      estatus: this.estatusSeleccionado,
      estatusOtraMotivo: this.estatusOtraMotivo,
      fechaFinalizacion: toISO(s.fechaFinalizacion),
      fechaEleccion: toISO(s.fechaEleccion),
      fechaCita: toISO(s.fechaCita),
      fechaRecorrido: toISO(s.fechaRecorrido),
      fechaCarta: toISO(s.fechaCarta),
      docsCompletos: !!s.docsCompletos,
      fechaAceptacion: toISO(s.fechaAceptacion),
      fechaNotaria: toISO(s.fechaNotaria),
      fechaBorrador: toISO(s.fechaBorrador),
      fechaFirma: toISO(s.fechaFirma),
      fechaCartaOferta: toISO(s.fechaCartaOferta),
      documentosCompletos: !!s.documentosCompletos,
      fechaBorradorArr: toISO(s.fechaBorradorArr),
      fechaFirmaArr: toISO(s.fechaFirmaArr),
    };

    // ✅ LÓGICA DE CIERRE AUTOMÁTICO
    if (this.tipoOperacionCliente === 'VENTA' && s.fechaFirma) {
      cambios.estadoFinal = 'ganado';
      cambios.estatus = 'Firma completada';
    }

    if (this.tipoOperacionCliente === 'RENTA' && s.fechaFirmaArr) {
      cambios.estadoFinal = 'ganado';
      cambios.estatus = 'Contrato firmado';
    }

    // ✅ Si el agente lo marcó como "Se decidió por otra opción"
    if (this.estatusSeleccionado === 'Se decidió por otra opción') {
      cambios.estadoFinal = 'perdido';
      cambios.estatus = 'Perdido';
    }

    this.seguimientoSrv.actualizar(this.idSeguimiento, cambios).subscribe({
      next: (resp) => {
        console.log('✅ Seguimiento actualizado correctamente:', resp);

        // actualizar UI para reflejar cambios
        this.seguimientoCliente = { ...this.seguimientoCliente, ...cambios };

        if (cambios.estadoFinal === 'ganado') {
          alert('🎉 Seguimiento CERRADO como GANADO automáticamente');
        }

        if (cambios.estadoFinal === 'perdido') {
          alert('❌ Seguimiento CERRADO como PERDIDO');
        }
      },
      error: (err) => console.error('❌ Error al actualizar seguimiento:', err),
    });
  }


  mostrarCampoOtra(): boolean {
    return this.estatusSeleccionado === 'Otras';
  }
  marcarGanado() {
  if (!this.idSeguimiento) return;
  this.seguimientoSrv.cerrarSeguimiento(this.idSeguimiento, 'ganado').subscribe({
    next: () => {
      alert('✅ Seguimiento marcado como GANADO');
      this.cargarSeguimientosAgente(this.seguimientoCliente.agenteEmail);
    }
  });
}

  marcarPerdido() {
    if (!this.idSeguimiento) return;
    this.seguimientoSrv.cerrarSeguimiento(this.idSeguimiento, 'perdido').subscribe({
      next: () => {
        alert('❌ Seguimiento marcado como PERDIDO');
        this.cargarSeguimientosAgente(this.seguimientoCliente.agenteEmail);
      }
    });
  }

}
