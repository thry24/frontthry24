import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  templateUrl: './seguimiento.page.html',
  styleUrls: ['./seguimiento.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SeguimientoPage {
  mostrarLineaTiempo = true;

  seguimientoCliente: {
    [key: string]: any;
    nombre: string;
    tipoCliente: string;
    fechaFinalizacion: string;
    fechaContacto: string;
    fechaEleccion: string;
    fechaCita: string;
    fechaRecorrido: string;
    fechaCarta: string;
    docsCompletos: boolean;
    fechaAceptacion: string;
    fechaNotaria: string;
    fechaBorrador: string;
    fechaFirma: string;
  } = {
    nombre: 'ALEJANDRO PEREZ',
    tipoCliente: 'ASESOR INMOBILIARIO',
    fechaFinalizacion: '2025-07-25',
    fechaContacto: '',
    fechaEleccion: '',
    fechaCita: '',
    fechaRecorrido: '',
    fechaCarta: '',
    docsCompletos: false,
    fechaAceptacion: '',
    fechaNotaria: '',
    fechaBorrador: '',
    fechaFirma: ''
  };
  


  estatusOperacionOpciones = [
    'No contesta',
    'En proceso',
    'Pendiente por confirmar cita',
    'Se decidió por otra opción',
    'Recorrido pendiente',
    'Otras'
  ];

  estatusSeleccionado: string = '';
  estatusOtraMotivo: string = '';

  tipoOperacionCliente: 'VENTA' | 'RENTA' = 'VENTA';

  nombreUsuario = 'Milla Willow';
  rolUsuario = 'Admin';
  fotoPerfil = 'assets/avatars/default.png';

  timelineVenta = [
    { paso: 'PRIMER CONTACTO', tipo: 'fecha', campo: 'fechaContacto' },
    { paso: 'ELECCION DE PROPIEDADES', tipo: 'fecha', campo: 'fechaEleccion' },
    { paso: 'CITA CONCERTADA', tipo: 'fecha', campo: 'fechaCita' },
    { paso: 'RECORRIDO PROGRAMADO', tipo: 'fecha', campo: 'fechaRecorrido' },
    { paso: 'SEGUNDA RETROALIMENTACION', tipo: 'accion' },
    // 👇 CAMBIO DE ORDEN AQUÍ
    { paso: 'ELABORACION CARTA OFERTA', tipo: 'fecha', campo: 'fechaCarta' },
    { paso: 'RECOLECCION DE DOCUMENTOS', tipo: 'check', campo: 'docsCompletos' },
    { paso: 'FIRMA DE ACEPTACION CARTA OFERTA', tipo: 'fecha', campo: 'fechaAceptacion' },
    { paso: 'DOCUMENTACION ENVIADA A NOTARIA', tipo: 'fecha', campo: 'fechaNotaria' },
    { paso: 'ENVIO BORRADOR DE CONTRATO', tipo: 'fecha', campo: 'fechaBorrador' },
    { paso: 'FECHA DE FIRMA NOTARIA', tipo: 'fecha', campo: 'fechaFirma' }
  ];

  timelineRenta = [
    { paso: 'PRIMER CONTACTO', tipo: 'fecha', campo: 'fechaPrimerContacto' },
    { paso: 'ELECCIÓN DE PROPIEDADES', tipo: 'accion' },
    { paso: 'CITA CONCERTADA', tipo: 'fecha', campo: 'fechaCita' },
    { paso: 'RECORRIDO PROGRAMADO', tipo: 'accion' },
    { paso: 'SEGUNDA RETROALIMENTACIÓN', tipo: 'accion' },
    { paso: 'SEGUNDO RECORRIDO', tipo: 'accion' },
    { paso: 'ELABORACIÓN CARTA OFERTA', tipo: 'fecha', campo: 'fechaCartaOferta' },
    { paso: 'FIRMA DE ACEPTACIÓN CARTA OFERTA', tipo: 'fecha', campo: 'fechaAceptacion' },
    { paso: 'RECOLECCIÓN DE DOCUMENTOS', tipo: 'check', campo: 'documentosCompletos' },
    { paso: 'INVESTIGACIÓN DE INQUILINO Y AVAL O PÓLIZA', tipo: 'accion' },
    { paso: 'ENVÍO BORRADOR DE CONTRATO DE ARRENDAMIENTO', tipo: 'fecha', campo: 'fechaBorradorArr' },
    { paso: 'FIRMA DE CONTRATO DE ARRENDAMIENTO', tipo: 'fecha', campo: 'fechaFirmaArr' },
  ];

  mostrarCampoOtra(): boolean {
    return this.estatusSeleccionado === 'Otras';
  }
}
