import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  constructor() {}

  clienteEligioPropiedades(direccion: string) {
    return ` Tu cliente ya eligió propiedades y agendó recorrido en ${direccion}.  Revisa tus recorridos para confirmar detalles.`;
  }

  propiedadElegida(tipo: 'venta' | 'renta', direccion: string) {
    if (tipo === 'venta') {
      return ` AI24: Un cliente eligió tu propiedad en ${direccion}. Tu asesor ya está preparando la Carta Oferta de compraventa.`;
    }
    return ` AI24: Un cliente eligió tu propiedad en ${direccion}. Tu asesor ya está preparando la Carta Oferta de arrendamiento.`;
  }

  cartaOfertaAceptada(direccion: string, link: string) {
    return ` AI24: Has aceptado la Carta Oferta de tu propiedad en ${direccion}.  Prepara tu documentación y súbela aquí: ${link}`;
  }

  cartaOfertaRechazada(direccion: string, motivo: string) {
    return `⚠ AI24: El propietario rechazó la Carta Oferta de la propiedad ${direccion}.  Motivo: ${motivo}`;
  }

  docsEnviadosNotaria() {
    return ` AI24: La documentación completa de tu operación fue enviada a notaría.  Tu asesor te informará la fecha de firma en los próximos días.`;
  }

  contratoParaRevision(tipo: 'venta' | 'renta', direccion: string, link: string) {
    if (tipo === 'venta') {
      return ` Contrato de compraventa de ${direccion} listo para revisión: ${link}. Confirma aprobación o ajustes.`;
    }
    return ` AI24: Tu contrato de arrendamiento de ${direccion} está listo para revisión.  Revísalo aquí: ${link} y confirma si lo apruebas o necesitas ajustes.`;
  }

  contratoArrendamientoInquilino(direccion: string, link: string) {
    return ` AI24: Tu contrato de arrendamiento de ${direccion} está listo para revisión.  Revísalo aquí: ${link} y confirma si lo apruebas o necesitas ajustes.`;
  }

  firmaProgramadaArrendamiento(direccion: string, fechaHora: string) {
    return `🗓 AI24: La firma del contrato de arrendamiento de ${direccion} está programada para el ${fechaHora}.`;
  }

  firmaProgramadaVenta(direccion: string, fechaHora: string) {
    return `🗓 AI24: La firma del contrato de compraventa de ${direccion} está programada para el ${fechaHora}.`;
  }

  firmaConcluida(tipo: 'propietario' | 'comprador', direccion: string) {
    if (tipo === 'propietario') {
      return ` La firma en ${direccion} concluyó. Línea cerrada y fecha registrada en Directorio de propietarios y clientes.`;
    }
    return ` La firma en ${direccion} concluyó. Línea cerrada y fecha registrada en Directorio de Clientes.`;
  }
}
