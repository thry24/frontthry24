import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { CitasService } from 'src/app/services/citas.service';
import { AuthService } from 'src/app/services/auth.service';
import { PropiedadService } from 'src/app/services/propiedad.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


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
    'Cita programada',  
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
  mostrarModalCarta = false;
  logoBase64: string = '';
  logoFooterBase64: string = '';
  mostrarModalBorrador = false;

  cartaOferta = {
    arrendatario: '',
    direccion: '',
    tipoPropiedad: '',
    clave: '',
    montoMensual: '',
    duracion: '',
    fechaInicio: '',
    deposito: '',
    garantia: '',
    formaPago: '',
    observaciones: '',
    asesor: '',
    agencia: '',
    tipoOperacion: '',
    descripcion: '',
    estadoPropiedad: '',
    comision: '',
    imagenPrincipal: ''
  };

  borradorContrato = {
    arrendador: '',
    arrendatario: '',
    direccion: '',
    tipoPropiedad: '',
    duracion: '',
    montoMensual: '',
    deposito: '',
    fechaInicio: '',
    garantia: '',
    observaciones: '',
    asesor: '',
    agencia: ''
  };

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

  constructor(private seguimientoSrv: SeguimientoService, private citasSrv: CitasService, private propiedadSrv: PropiedadService, private authSrv: AuthService) {

      (pdfMake as any).vfs = (pdfFonts as any).vfs;
  }

  ngOnInit(): void {
     this.cargarLogoFooter(); // ✅ carga el logo antes de usarlo
    const usuario = this.authSrv.obtenerUsuario(); // 👈 usa el servicio directamente

    if (!usuario || !(usuario.email || usuario.correo)) {
      console.warn('⚠️ No hay usuario en sesión, no se cargan seguimientos.');
      this.tieneSeguimiento = false;
      return;
    }

    const email = (usuario.email || usuario.correo || '').toLowerCase();

    // 🔸 Ya puedes cargar los seguimientos del usuario
    this.cargarSeguimientosUsuario(email);
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

  onLogoSeleccionado(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.logoBase64 = reader.result as string;
      console.log('✅ Logo cargado para PDF:', this.logoBase64);
    };
    reader.readAsDataURL(file);
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
  // ✅ Trae los seguimientos donde el usuario sea agente o cliente (desde el backend)
  cargarSeguimientosUsuario(email: string) {
    this.seguimientoSrv.obtenerPorAgente(email).subscribe({
      next: (res) => {
        this.seguimientos = (res || []).filter(
          (s: any) => s.agenteEmail === email || s.clienteEmail === email
        );
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

  abrirCartaOferta() {
    const seg = this.seguimientoCliente;

    if (!seg || !seg.propiedadId) {
      alert('⚠️ No se encontró la propiedad asociada a este seguimiento.');
      return;
    }

    // Inicializa carta con valores base
    this.cartaOferta = {
      arrendatario: seg.clienteNombre || '',
      direccion: '',
      tipoPropiedad: '',
      clave: '',
      montoMensual: '',
      duracion: '',
      fechaInicio: '',
      deposito: '',
      garantia: '',
      formaPago: '',
      observaciones: '',
      asesor: seg.agenteNombre || '',
      agencia: seg.agencia || '',
      tipoOperacion: '',
      descripcion: '',
      estadoPropiedad: '',
      comision: '',
      imagenPrincipal: ''
    };

    // 🔹 Llama al servicio para obtener TODA la propiedad
    this.propiedadSrv.obtenerPropiedadPorId(seg.propiedadId).subscribe({
      next: (prop: any) => {
        console.log('📦 Propiedad cargada:', prop);

        // 🏠 Dirección — combina todos los niveles posibles
        const direccion = prop?.direccion
          ? [
              prop.direccion.calle,
              prop.direccion.colonia,
              prop.direccion.municipio,
              prop.direccion.estado,
              prop.direccion.cp
            ]
              .filter(Boolean)
              .join(', ')
          : prop?.direccionTexto ||
            prop?.ubicacion ||
            'Sin dirección registrada';

        // ✅ Carga todos los datos relevantes de la propiedad
        this.cartaOferta.direccion = direccion;
        this.cartaOferta.tipoPropiedad = prop.tipoPropiedad || '';
        this.cartaOferta.clave = prop.clave || '';
        this.cartaOferta.montoMensual = prop.precio ? prop.precio.toLocaleString() : '';
        this.cartaOferta.tipoOperacion = prop.tipoOperacion?.toUpperCase() || '';
        this.cartaOferta.descripcion = prop.descripcion || '';
        this.cartaOferta.estadoPropiedad = prop.estadoPropiedad || '';
        this.cartaOferta.comision = prop?.comision?.porcentaje || '';
        this.cartaOferta.imagenPrincipal = prop.imagenPrincipal || prop.imagenes?.[0] || '';

        // 🔹 Abre modal cuando ya está todo listo
        this.mostrarModalCarta = true;
      },
      error: (err) => {
        console.error('❌ Error al obtener la propiedad:', err);
        alert('No se pudieron cargar los datos de la propiedad.');
      }
    });
  }

  abrirCartaOfertaDesdeLineaTiempo() {
    this.abrirCartaOferta();

    // Guarda automáticamente la fecha actual como fechaCartaOferta
    const hoy = new Date().toISOString().split('T')[0];
    this.seguimientoCliente.fechaCartaOferta = hoy;

    // Opcional: guarda en backend inmediatamente
    this.seguimientoSrv.actualizar(this.seguimientoCliente._id, {
      fechaCartaOferta: hoy
    }).subscribe({
      next: () => console.log('📅 Fecha de carta oferta registrada.'),
      error: (err) => console.error('Error guardando fechaCartaOferta', err)
    });
  }

  cargarLogoFooter() {
    const imgPath = 'assets/logo-thry24.jpeg'; // 👈 ruta dentro de /src/assets/
    const xhr = new XMLHttpRequest();
    xhr.open('GET', imgPath, true);
    xhr.responseType = 'blob';

    xhr.onload = () => {
      if (xhr.status === 200) {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logoFooterBase64 = reader.result as string;
          console.log('✅ Logo footer cargado correctamente');
        };
        reader.readAsDataURL(xhr.response);
      } else {
        console.error('❌ No se pudo cargar el logo desde assets/logo-thry24.png');
      }
    };

    xhr.onerror = () => console.error('❌ Error de red al cargar el logo footer.');
    xhr.send();
  }



  cerrarCartaOferta() {
    this.mostrarModalCarta = false;
  }

  // 👇 para abrir y cerrar el modal
  abrirModalBorradorContrato() {
    // precargar datos desde cartaOferta o seguimiento si existen
    this.borradorContrato.arrendatario = this.cartaOferta.arrendatario || this.seguimientoCliente.clienteNombre || '';
    this.borradorContrato.direccion = this.cartaOferta.direccion || '';
    this.borradorContrato.tipoPropiedad = this.cartaOferta.tipoPropiedad || '';
    this.borradorContrato.montoMensual = this.cartaOferta.montoMensual || '';
    this.borradorContrato.deposito = this.cartaOferta.deposito || '';
    this.borradorContrato.asesor = this.cartaOferta.asesor || '';
    this.borradorContrato.agencia = this.cartaOferta.agencia || '';
    this.mostrarModalBorrador = true;
  }

  cerrarModalBorradorContrato() {
    this.mostrarModalBorrador = false;
  }
  
  generarCartaPDF() {
    const p = this.cartaOferta;

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 50, 40, 60],
      content: [
        { text: 'CARTA OFERTA DE RENTA', style: 'titulo' },
        { text: '\n1. DATOS DEL ARRENDATARIO (CLIENTE INTERESADO)', style: 'subtitulo' },
        { text: `Nombre completo: ${p.arrendatario || '______________________________'}` },

        { text: '\n2. DATOS DEL INMUEBLE', style: 'subtitulo' },
        { text: `Dirección: ${p.direccion || '________________________________________'}` },
        { text: `Tipo de propiedad: [${p.tipoPropiedad === 'Casa' ? 'X' : ' '}] Casa  [${p.tipoPropiedad === 'Departamento' ? 'X' : ' '}] Departamento  [${p.tipoPropiedad === 'Oficina' ? 'X' : ' '}] Oficina  [${!['Casa','Departamento','Oficina'].includes(p.tipoPropiedad) ? 'X' : ' '}] Otro: ${!['Casa','Departamento','Oficina'].includes(p.tipoPropiedad) ? p.tipoPropiedad : ''}` },
        { text: `Clave interna / ID de propiedad: ${p.clave || '__________________'}` },

        { text: '\n3. CONDICIONES DE LA OFERTA DE ARRENDAMIENTO', style: 'subtitulo' },
        { text: `Monto mensual ofrecido: $${p.montoMensual || '__________'} MXN` },
        { text: `Duración del contrato: [${p.duracion === '6 meses' ? 'X' : ' '}] 6 meses  [${p.duracion === '12 meses' ? 'X' : ' '}] 12 meses  [${!['6 meses','12 meses'].includes(p.duracion) ? 'X' : ' '}] Otro: ${!['6 meses','12 meses'].includes(p.duracion) ? p.duracion : ''}` },
        { text: `Fecha de inicio contrato arrendamiento: ${p.fechaInicio || '____ /____ /______'}` },
        { text: `Depósito ofrecido: $${p.deposito || '__________'}` },
        { text: `Tipo de garantía: [${p.garantia === 'Fiador' ? 'X' : ' '}] Fiador  [${p.garantia === 'Póliza jurídica' ? 'X' : ' '}] Póliza jurídica  [${p.garantia === 'Depósito adicional' ? 'X' : ' '}] Depósito adicional  [${!['Fiador','Póliza jurídica','Depósito adicional'].includes(p.garantia) ? 'X' : ' '}] Otro: ${!['Fiador','Póliza jurídica','Depósito adicional'].includes(p.garantia) ? p.garantia : ''}` },
        { text: `Forma de pago: [${p.formaPago === 'Transferencia' ? 'X' : ' '}] Transferencia  [${p.formaPago === 'Depósito' ? 'X' : ' '}] Depósito  [${p.formaPago === 'Efectivo' ? 'X' : ' '}] Efectivo  [${!['Transferencia', 'Depósito', 'Efectivo'].includes(p.formaPago) ? 'X' : ' '}] Otro: ${!['Transferencia', 'Depósito', 'Efectivo'].includes(p.formaPago) ? p.formaPago : ''}`},

        { text: '\n4. OBSERVACIONES ADICIONALES', style: 'subtitulo' },
        { text: `${p.observaciones || '__________________________________________'}` },
                { text: '\n4. CONDICIONES DE RENTA', style: 'subtitulo' },
        {
          ul: [
            `El arrendatario deberá realizar el pago de la renta de $${p.montoMensual || '__________'} MXN dentro de los primeros 5 días de cada mes.`,
            `El depósito de garantía será equivalente a $${p.deposito || '__________'} MXN y se devolverá conforme al contrato.`,
            `La duración propuesta del contrato es de ${p.duracion || '12 meses'}.`,
            `El arrendatario no podrá subarrendar ni ceder derechos sin autorización escrita.`,
            `El arrendatario acepta mantener el inmueble en óptimas condiciones y cumplir con las políticas establecidas.`,
          ],
          margin: [10, 0, 0, 10]
        },
        { text: '\n5. COMPROMISOS', style: 'subtitulo' },
        { text: 'El arrendatario expresa formalmente su interés en rentar la propiedad descrita bajo los términos señalados. Esta carta no constituye un contrato definitivo, pero sí una intención de renta sujeta a la aceptación del propietario y validación de la documentación correspondiente.', margin: [0, 0, 0, 10] },

        { text: '6. DATOS DEL ASESOR INMOBILIARIO', style: 'subtitulo' },
        { text: `Nombre del asesor: ${p.asesor || '_________________________'}` },
        { text: `Agencia (si aplica): ${p.agencia || '_________________________'}` },

        { text: '\n7. FIRMAS', style: 'subtitulo' },
        { text: '\nFirma del Arrendatario (Cliente): _______________________________  Fecha: ____/____/______'},
        { text: 'Firma del Propietario (en caso de aceptación): ___________________  Fecha: ____/____/______' },
        { text: 'Firma del Asesor Inmobiliario: _________________________________  Fecha: ____/____/______' },

      ],
      styles: {
        titulo: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          color: '#0a58ca',
          margin: [0, 0, 0, 15],
          decoration: 'underline',
          lineHeight: 1.5,
        },
        subtitulo: {
          fontSize: 12,
          bold: true,
          color: '#0a58ca',
          margin: [0, 5, 0, 3],
          lineHeight: 1.5,
        },
        nota: {
          fontSize: 9,
          italics: true,
          color: 'gray',
        },
        footer: {
          fontSize: 9,
          color: 'gray',
          margin: [0, 20, 0, 0]
        }
      },
      footer: (currentPage: number, pageCount: number) => {
        const logoImage = this.logoFooterBase64
          ? { image: this.logoFooterBase64, width: 60, height: 60, alignment: 'center', margin: [0, 0, 0, 10] }
          : { text: '' }; // 👈 Evita pasar un objeto vacío o inválido

        return {
          columns: [
            { text: `Página ${currentPage} de ${pageCount}`, alignment: 'left', fontSize: 8, margin: [40, 10, 0, 0] },
            logoImage,
            { text: 'CRM Thry24 – CRM Inmobiliario', alignment: 'right', fontSize: 8, margin: [0, 10, 40, 0] }
          ]
        };
      }
    };
    if (this.logoBase64) {
      docDefinition.background = {
        image: this.logoBase64,
        width: 400,
        opacity: 0.1,
        alignment: 'center',
        margin: [0, 100, 0, 0]
      };
    }
      pdfMake.createPdf(docDefinition).open();
    }

    generarBorradorContratoPDF() {
    const p = this.cartaOferta; // reutilizamos los datos de cartaOferta para el contrato

    const hoy = new Date();
    const fechaGeneracion = hoy.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 50, 40, 60],
      content: [
        { text: 'BORRADOR DE CONTRATO DE ARRENDAMIENTO', style: 'titulo' },

        { text: `\nFecha de elaboración: ${fechaGeneracion}`, style: 'nota' },

        { text: '\n1. PARTES DEL CONTRATO', style: 'subtitulo' },
        { text: `ARRENDADOR: ____________________________________________`, style: 'campo' },
        { text: `ARRENDATARIO: ${p.arrendatario || '________________________________________'}`, style: 'campo' },

        { text: '\n2. OBJETO DEL CONTRATO', style: 'subtitulo' },
        { text: `El ARRENDADOR da en arrendamiento al ARRENDATARIO el inmueble ubicado en:\n${p.direccion || '________________________________________'}.\n` , style: 'campo'},
        { text: `Tipo de propiedad: ${p.tipoPropiedad || '________________'}`, style: 'campo' },

        { text: '\n3. DURACIÓN', style: 'subtitulo' },
        { text: `El presente contrato tendrá una duración de ${p.duracion || '__________'}, iniciando el día ${p.fechaInicio || '____/____/______'} y concluyendo conforme al plazo pactado.`, style: 'campo' },
        
        { text: '\n4. CONDICIONES DE RENTA', style: 'subtitulo' },
        {
          ul: [
            `El arrendatario deberá realizar el pago de la renta de $${p.montoMensual || '__________'} MXN dentro de los primeros 5 días de cada mes.`,
            `El depósito de garantía será equivalente a $${p.deposito || '__________'} MXN y se devolverá conforme al contrato.`,
            `La duración propuesta del contrato es de ${p.duracion || '12 meses'}.`,
            `El arrendatario no podrá subarrendar ni ceder derechos sin autorización escrita.`,
            `El arrendatario acepta mantener el inmueble en óptimas condiciones y cumplir con las políticas establecidas.`,
          ],
          margin: [10, 0, 0, 10]
        },

        { text: '\n5. RENTA Y DEPÓSITO', style: 'subtitulo' },
        { text: `El ARRENDATARIO pagará al ARRENDADOR la cantidad de $${p.montoMensual || '__________'} MXN mensuales.`, style: 'campo' },
        { text: `El depósito en garantía será de $${p.deposito || '__________'} MXN, que será devuelto al término del contrato si no existen adeudos ni daños al inmueble.` , style: 'campo'},

        { text: '\n6. GARANTÍA Y FORMA DE PAGO', style: 'subtitulo' },
        { text: `Tipo de garantía: ${p.garantia || '__________________'}`, style: 'campo' },
        { text: `Forma de pago: ${p.formaPago || '__________________'}` , style: 'campo'},

        { text: '\n7. OBLIGACIONES DEL ARRENDATARIO', style: 'subtitulo' },
        {
          ul: [
            'Pagar puntualmente la renta en la forma y tiempo convenidos.',
            'Usar el inmueble exclusivamente para el fin acordado.',
            'Conservar el inmueble en buen estado.',
            'Permitir inspecciones razonables del propietario cuando sea necesario.'
          ]
        },

        { text: '\n8. OBLIGACIONES DEL ARRENDADOR', style: 'subtitulo' },
        {
          ul: [
            'Entregar el inmueble en condiciones adecuadas para su uso.',
            'Realizar reparaciones mayores que no sean imputables al arrendatario.',
            'Respetar la posesión pacífica del inmueble durante el contrato.'
          ]
        },

        { text: '\n9. TERMINACIÓN ANTICIPADA', style: 'subtitulo' },
        { text: 'El contrato podrá darse por terminado anticipadamente por incumplimiento de cualquiera de las partes o de común acuerdo, notificando con al menos 30 días de anticipación.' , style: 'campo'},

        { text: '\n10. JURISDICCIÓN Y DOMICILIO', style: 'subtitulo' },
        { text: 'Para la interpretación y cumplimiento del presente contrato, las partes se someten expresamente a las leyes y tribunales competentes de la ciudad donde se encuentra el inmueble, renunciando a cualquier otro fuero que pudiera corresponderles.', style: 'campo' },

        { text: '\n11. FIRMAS', style: 'subtitulo' },
        { text: '\nFirma del Arrendador: ___________________________  Fecha: ____/____/______' , style: 'campo'},
        { text: 'Firma del Arrendatario: __________________________  Fecha: ____/____/______', style: 'campo' },
        { text: 'Firma del Asesor Inmobiliario: ____________________  Fecha: ____/____/______', style: 'campo' },

        { text: '\nNOTA: Este documento es un borrador y no constituye un contrato definitivo. Su contenido puede modificarse previo acuerdo entre las partes.', style: 'nota' }
      ],

      styles: {
        titulo: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          color: '#0a58ca',
          margin: [0, 0, 0, 15],
          decoration: 'underline',
          lineHeight: 1.4
        },
        subtitulo: {
          fontSize: 12,
          bold: true,
          color: '#0a58ca',
          margin: [0, 8, 0, 3],
          lineHeight: 1.3
        },
        nota: {
          fontSize: 9,
          italics: true,
          color: 'gray',
          margin: [0, 5, 0, 10]
        },
        campo: {
          fontSize: 11,
          color: '#000',
          margin: [0, 0, 0, 6], // 👈 separa cada línea de texto
          lineHeight: 1.4
        }
      },

      footer: (currentPage: number, pageCount: number) => {
        const logoImage = this.logoFooterBase64
          ? { image: this.logoFooterBase64, width: 60, height: 60, alignment: 'center', margin: [0, 0, 0, 10] }
          : { text: '' };

        return {
          columns: [
            { text: `Página ${currentPage} de ${pageCount}`, alignment: 'left', fontSize: 8, margin: [40, 10, 0, 0] },
            logoImage,
            { text: 'CRM Thry24 – CRM Inmobiliario', alignment: 'right', fontSize: 8, margin: [0, 10, 40, 0] }
          ]
        };
      }
    };

    // Marca de agua
    if (this.logoBase64) {
      docDefinition.background = {
        image: this.logoBase64,
        width: 400,
        opacity: 0.1,
        alignment: 'center',
        margin: [0, 100, 0, 0]
      };
    }

    pdfMake.createPdf(docDefinition).open();

    // 🗓️ Actualiza automáticamente la fecha en seguimiento
    this.seguimientoCliente.fechaBorradorContrato = fechaGeneracion;
    this.seguimientoSrv.actualizar(this.seguimientoCliente._id, {
      fechaBorradorArr: fechaGeneracion
    }).subscribe(() => console.log('📄 Fecha de borrador contrato actualizada.'));
  }

  onToggleDocumentosCompletos(campo: string) {
      const nuevoValor = this.seguimientoCliente[campo];

      // Si quieres actualizarlo visualmente sin esperar respuesta:
      this.seguimientoCliente[campo] = nuevoValor;

      // 🔄 Llamar al servicio para guardar el cambio
      this.seguimientoSrv.actualizar(this.seguimientoCliente._id, {
        [campo]: nuevoValor
      }).subscribe({
        next: () => {
          console.log(`✅ Campo "${campo}" actualizado a: ${nuevoValor}`);
        },
        error: (err) => {
          console.error('❌ Error al actualizar documentos completos:', err);
        }
      });
    }

  }
