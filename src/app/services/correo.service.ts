import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CorreoService {
  constructor() {}

  // 1) Cliente eligió propiedades
  clienteEligioPropiedades(
    nombreAsesor: string,
    nombreCliente: string,
    propiedades: Array<{
      id: string;
      titulo: string;
      precio: number;
      tipo: string;
      url: string;
      imagen?: string;
    }>
  ) {
    const asunto = 'Tu cliente ha seleccionado propiedades para visitar';

    let listado = '';
    propiedades.forEach((p, i) => {
      listado += `
      <div style="margin-bottom:16px;">
        <p> <strong>${p.id}</strong> - ${p.titulo}</p>
        <p> Precio: ${p.precio.toLocaleString()}</p>
        <p> Tipo: ${p.tipo}</p>
        ${
          p.imagen
            ? `<img src="${p.imagen}" alt="Propiedad" width="200" style="border-radius:8px;"/>`
            : ''
        }
        <p> <a href="${p.url}">Ver Ficha Técnica</a></p>
      </div>
      `;
    });

    const cuerpo = `
      <p>Hola ${nombreAsesor},</p>
      <p>Tu cliente <strong>${nombreCliente}</strong> ha elegido las siguientes propiedades para recorrer:</p>
      ${listado}
      <p> Te sugerimos confirmar la disponibilidad en tu pestaña de citas programadas y coordinar la cita de recorrido.</p>
    `;

    return { asunto, cuerpo };
  }

  // 2) Catálogo de motivos predefinidos
  catalogoMotivos(nombreAsesor: string, motivo: string, detalle?: string) {
    const asunto = 'Motivo de reprogramación o cancelación de cita';

    const cuerpo = `
      <p>Hola,</p>
      <p>El asesor <strong>${nombreAsesor}</strong> ha seleccionado el siguiente motivo:</p>
      <p> ${motivo}</p>
      ${motivo === 'Otro' && detalle ? `<p>✏ Detalle: ${detalle}</p>` : ''}
    `;

    return { asunto, cuerpo };
  }

  // 3) Notificación entre asesores
  notificacionAsesor(
    nombreAsesorSolicitante: string,
    nombreAsesorDestino: string,
    propiedadId: string
  ) {
    const asunto = 'Solicitud de colaboración para mostrar propiedad';

    const cuerpo = `
      <p>Hola ${nombreAsesorDestino},</p>
      <p>El asesor <strong>${nombreAsesorSolicitante}</strong> quiere colaborar contigo.</p>
      <p>Te solicita confirmar una cita para mostrar tu propiedad <strong>${propiedadId}</strong> a un cliente interesado.</p>
      <p> Ingresa al sistema y confirma la disponibilidad desde citas programadas en el botón “Acción”.</p>
      <p>Por favor, prepárate para mostrarla y confirma la cita. ¡Mucho éxito!</p>
    `;

    return { asunto, cuerpo };
  }

  confirmacionCitaColaboracion(
    nombreAsesor: string,
    nombreAsesorExterno: string,
    propiedadId: string,
    fechaHora: string
  ) {
    const asunto =
      'Confirmación de cita en colaboración – Propiedad disponible';

    const cuerpo = `
    <p>Hola ${nombreAsesor},</p>
    <p>El asesor <strong>${nombreAsesorExterno}</strong> ha confirmado la disponibilidad de su propiedad para el recorrido solicitado con tu cliente.</p>
    <p> Propiedad: ${propiedadId}</p>
    <p>🗓 Fecha y hora: ${fechaHora}</p>
    <p> La cita ha quedado confirmada y se actualizó en tu agenda y en la pestaña de Recorridos Programados.</p>
  `;

    return { asunto, cuerpo };
  }

  ventanaEmergenteAsesorExterno() {
    const asunto = 'Confirmación de cita';
    const cuerpo = `
    <p> La cita ha sido confirmada.</p>
    <p>¿Quieres compartir ahora la ubicación del inmueble o prefieres que el asesor/cliente la reciba más cerca del recorrido?</p>
  `;
    return { asunto, cuerpo };
  }

  notificacionChecklistCliente(enlaceDocumentos: string) {
    const asunto = 'Checklist de documentación para continuar con tu compra';

    const cuerpo = `
    <p>¡Felicidades!  Ha dado un gran paso al adquirir su nuevo inmueble .</p>
    <p>Para continuar con el proceso, le comparto el checklist de documentos que necesitamos:</p>
    <p> <a href="${enlaceDocumentos}" target="_blank">Ver y adjuntar documentos</a></p>
    <p>Puede subirlos directamente en el enlace.</p>
    <p>¡Estamos cada vez más cerca de concretar la operación!</p>
  `;

    return { asunto, cuerpo };
  }

  checklistDocumentacionVenta() {
    const asunto = 'Checklist de documentación para proceso de VENTA';
    const cuerpo = `
    <p>Para continuar con la compraventa de tu inmueble, necesitamos la siguiente documentación:</p>
    <ul>
      <li>[ ] Identificación oficial (INE o pasaporte)</li>
      <li>[ ] CURP</li>
      <li>[ ] RFC - Constancia de Situación Fiscal</li>
      <li>[ ] Comprobante de domicilio reciente</li>
      <li>[ ] Comprobantes de ingresos (últimos 3 meses)</li>
      <li>[ ] Acta de matrimonio (si aplica)</li>
      <li>[ ] Depósito Apartado (comprobante)</li>
    </ul>
    <p style="font-size:12px;color:#666;"> En caso de estar casado por bienes mancomunados, será necesario también el INE del cónyuge.</p>
  `;
    return { asunto, cuerpo };
  }

  checklistDocumentacionRenta(
    nombrePropietario?: string,
    nombreAsesor?: string,
    notificarPropietario = false,
    notificarPoliza = false
  ) {
    const asunto = 'Checklist de documentación para proceso de RENTA';

    let cuerpo = `
    <p>Para continuar con el arrendamiento del inmueble, necesitamos la siguiente documentación:</p>
    <ul>
      <li>[ ] Identificación oficial (INE o pasaporte)</li>
      <li>[ ] CURP</li>
      <li>[ ] RFC - Constancia de Situación Fiscal</li>
      <li>[ ] Comprobante de domicilio reciente</li>
      <li>[ ] Comprobantes de ingresos (últimos 3 meses)</li>
      <li>[ ] Carta laboral o constancia de ingresos</li>
      <li>[ ] Referencias personales (mínimo 2)</li>
      <li>[ ] Referencias laborales</li>
      <li>[ ] Información del aval o póliza jurídica (si aplica)</li>
      <li>[ ] Copia de identificación del aval (si aplica)</li>
      <li>[ ] Recibo de Apartado</li>
    </ul>
    <p style="font-size:12px;color:#666;"> Si el cliente arrendatario seleccionó póliza jurídica desde el inicio, una vez cargados los documentos se notificará directamente a la póliza elegida.</p>
  `;

    if (notificarPropietario && nombrePropietario && nombreAsesor) {
      cuerpo += `
      <hr/>
      <p> Notificación para el Propietario:</p>
      <p><strong>Asunto:</strong> Documentación del arrendatario disponible</p>
      <p>Hola ${nombrePropietario}, te informamos que el arrendatario ha cargado su documentación al sistema.</p>
      <p>Gracias por confiar en nosotros.<br/>${nombreAsesor}</p>
    `;
    }

    if (notificarPoliza) {
      cuerpo += `
      <hr/>
      <p> Se ha notificado también a la póliza jurídica seleccionada por el arrendatario.</p>
    `;
    }

    return { asunto, cuerpo };
  }

  notificacionDocumentosAsesor(nombreAsesor: string, linkDocumentos: string) {
    const asunto = 'Documentos del cliente recibidos';
    const cuerpo = `
    <p>Hola ${nombreAsesor},</p>
    <p>Tu cliente ha subido toda la documentación requerida al sistema. Ya está disponible para revisión y validación.</p>
    <p> <a href="${linkDocumentos}" target="_blank">Ver Documentación</a></p>
    <p>Saludos,<br/>Equipo AI24</p>
    <p style="font-size:12px;color:#666;">Nota: los documentos se clasificaron en el área de formatos de acuerdo al ID de la propiedad que eligió el cliente.</p>
  `;
    return { asunto, cuerpo };
  }

  notificacionPropiedadElegida(
    tipo: 'venta' | 'renta',
    nombrePropietario: string,
    direccion: string
  ) {
    let asunto = '';
    let cuerpo = '';

    if (tipo === 'venta') {
      asunto = 'Un cliente ha elegido tu propiedad ';
      cuerpo = `
      <p>Hola ${nombrePropietario},</p>
      <p>Un cliente comprador ha seleccionado tu propiedad ubicada en <strong>${direccion}</strong>.</p>
      <p>Tu asesor inmobiliario está elaborando la Carta Oferta de compraventa, que en breve te será enviada para tu revisión y firma.</p>
      <p> Te mantendremos informado en cada paso del proceso.</p>
    `;
    } else {
      asunto = 'Tu propiedad ha sido elegida para renta ';
      cuerpo = `
      <p>Hola ${nombrePropietario},</p>
      <p>Un cliente arrendador ha seleccionado tu propiedad ubicada en <strong>${direccion}</strong>.</p>
      <p>Tu asesor inmobiliario está elaborando la Carta Oferta de arrendamiento, que en breve recibirás para revisión y firma.</p>
      <p> Pronto se te compartirá el siguiente paso para continuar con la operación.</p>
    `;
    }

    return { asunto, cuerpo };
  }

  notificacionDocumentacionPropietario(
    tipo: 'venta' | 'renta',
    nombrePropietario: string,
    direccion: string,
    linkSubida: string
  ) {
    const asunto =
      tipo === 'venta'
        ? 'Documentación necesaria para continuar con la venta de tu propiedad '
        : 'Documentación necesaria para continuar con la renta de tu propiedad ';

    const docs = `
    <ul>
      <li>Escritura del inmueble</li>
      <li>Identificación oficial</li>
      <li>Acta de nacimiento</li>
      <li>Acta de matrimonio (si aplica)</li>
      <li>Comprobante de domicilio reciente</li>
      <li>CURP</li>
      <li>RFC / Constancia de situación fiscal</li>
      <li>Último predial, agua y luz pagados</li>
      <li>Carta de no adeudo (agua / mantenimiento)</li>
      <li>Certificado de libertad de gravamen</li>
      <li>Plano (si se tiene)</li>
      <li>Avalúo vigente (si se cuenta con él)</li>
      <li>Contrato de compraventa/arrendamiento anterior (si aplica)</li>
    </ul>
  `;

    const cuerpo = `
    <p>Hola ${nombrePropietario},</p>
    <p>Has aceptado la Carta Oferta de ${
      tipo === 'venta' ? 'compraventa' : 'arrendamiento'
    } de tu propiedad ubicada en <strong>${direccion}</strong>.</p>
    <p>Para continuar con el proceso, prepara y sube la siguiente documentación en el siguiente enlace seguro:</p>
    <p> <a href="${linkSubida}" target="_blank">Subir Documentos</a></p>
    <p> Documentación requerida:</p>
    ${docs}
    <p>Tu asesor te guiará durante este proceso y verificará que todo esté en orden para la notaría.</p>
  `;

    return { asunto, cuerpo };
  }

  respuestaCartaOfertaRechazo(
    nombreAsesor: string,
    direccion: string,
    motivo: string
  ) {
    const asunto = 'Respuesta de Carta Oferta – Rechazo';
    const cuerpo = `
    <p>Hola ${nombreAsesor},</p>
    <p>El propietario de la propiedad ubicada en <strong>${direccion}</strong> no aceptó la Carta Oferta enviada por tu cliente.</p>
    <p> <strong>Motivo del rechazo:</strong></p>
    <blockquote>${motivo}</blockquote>
    <p> Te recomendamos contactar al propietario para analizar la situación y comunicar la respuesta a tu cliente interesado.</p>
  `;
    return { asunto, cuerpo };
  }
  notificacionDocsNotariaPropietario(
    nombrePropietario: string,
    direccion: string
  ) {
    const asunto = `Documentación enviada a notaría – ${direccion}`;
    const cuerpo = `
    <p>Hola ${nombrePropietario},</p>
    <p>Tu asesor inmobiliario ha enviado la documentación completa de tu propiedad a la notaría seleccionada por el cliente.</p>
    <p> Tu asesor te mantendrá informado sobre la fecha de firma y los siguientes pasos.</p>
  `;
    return { asunto, cuerpo };
  }

  notificacionDocsNotariaComprador(nombreComprador: string, direccion: string) {
    const asunto = `Documentación enviada a notaría – ${direccion}`;
    const cuerpo = `
    <p>Hola ${nombreComprador},</p>
    <p>Tu asesor inmobiliario ha enviado toda la documentación de tu operación a la notaría que seleccionaste.</p>
    <p> En breve recibirás la confirmación de la fecha de firma y los detalles finales.</p>
  `;
    return { asunto, cuerpo };
  }

  documentacionListaRenta(nombreAsesor: string, direccion: string) {
    const asunto = 'Documentación completa lista para revisión – Renta';
    const cuerpo = `
    <p>Hola ${nombreAsesor},</p>
    <p>Los documentos del propietario e inquilino ya están completos para la propiedad en <strong>${direccion}</strong>.</p>
    <p> Ahora debes continuar con el siguiente paso:</p>
    <ul>
      <li>Si el cliente eligió póliza jurídica: Envía la documentación a la empresa de pólizas desde tu bandeja de mensajes.</li>
      <li>Si el cliente eligió aval: Inicia la investigación del aval y del inquilino.</li>
    </ul>
  `;
    return { asunto, cuerpo };
  }

  resultadoInvestigacionPropietario(
    nombrePropietario: string,
    aprobado: boolean
  ) {
    const asunto = aprobado
      ? 'Investigación aprobada – Tu propiedad puede ser rentada '
      : 'Investigación no aprobada – Proceso detenido ⚠';

    const cuerpo = aprobado
      ? `
      <p>Hola ${nombrePropietario},</p>
      <p>La póliza jurídica / investigación del aval y del inquilino ha sido aprobada exitosamente.</p>
      <p> Tu asesor continuará con el proceso y en breve recibirás el borrador del contrato de arrendamiento para revisión y firma.</p>
    `
      : `
      <p>Hola ${nombrePropietario},</p>
      <p>La póliza jurídica / investigación del aval y del inquilino no fue aprobada.</p>
      <p> Tu asesor te contactará para definir si deseas evaluar otro inquilino o replantear la estrategia de renta de tu propiedad.</p>
    `;

    return { asunto, cuerpo };
  }

  resultadoInvestigacionInquilino(nombreInquilino: string, aprobado: boolean) {
    const asunto = aprobado
      ? 'Investigación aprobada – Puedes avanzar con tu contrato '
      : 'Investigación no aprobada – Proceso detenido ⚠';

    const cuerpo = aprobado
      ? `
      <p>Hola ${nombreInquilino},</p>
      <p>Tu póliza jurídica / investigación de aval ha sido aprobada.</p>
      <p> Tu asesor inmobiliario te contactará para enviarte el borrador del contrato de arrendamiento y los siguientes pasos para la firma.</p>
    `
      : `
      <p>Hola ${nombreInquilino},</p>
      <p>Lamentamos informarte que tu póliza jurídica / investigación de aval no fue aprobada.</p>
      <p> Tu asesor inmobiliario te contactará para explicarte el motivo y orientarte sobre los siguientes pasos.</p>
    `;

    return { asunto, cuerpo };
  }

  ventanaEmergenteEnvioDocumento(
    tipoDoc: 'Borrador de notaría' | 'Contrato de arrendamiento',
    direccion: string
  ) {
    const asunto = `¿Deseas enviar este documento al cliente?`;
    const cuerpo = `
    <h3> ¿Deseas enviar este documento al cliente?</h3>
    <p>Has clasificado un <strong>${tipoDoc}</strong> para la propiedad <strong>${direccion}</strong>.</p>
    <p>¿Quieres enviarlo ahora a tu cliente para su revisión?</p>
    <p><strong>Opciones de envío:</strong></p>
    <ul>
      <li>Propietario</li>
      <li>Cliente comprador</li>
      <li>Inquilino</li>
      <li>Asesor en colaboración</li>
    </ul>
    <p> Selecciona a quién deseas enviar el documento. Una vez enviado, se registrará en la línea de tiempo como “Borrador enviado”.</p>
    <p><em>Acciones disponibles:</em>  Enviar ahora |  Guardar para enviar más tarde |  Cancelar</p>
  `;
    return { asunto, cuerpo };
  }

  envioBorradorPropietario(
    tipo: 'venta' | 'renta',
    nombrePropietario: string,
    direccion: string,
    link: string
  ) {
    let asunto = '';
    let cuerpo = '';

    if (tipo === 'venta') {
      asunto = `Borrador de notaría para revisión – ${direccion}`;
      cuerpo = `
      <p>Hola ${nombrePropietario},</p>
      <p>Tu asesor te envía el borrador de proyecto de notaría de tu operación sobre <strong>${direccion}</strong>.</p>
      <p>Por favor revísalo y comparte tus comentarios.</p>
      <p> <a href="${link}" target="_blank">Ver borrador</a></p>
      <p>Acciones sugeridas:  Aprobar | ✏ Solicitar ajustes | ☎ Contactar a mi agente</p>
    `;
    } else {
      asunto = `Contrato de arrendamiento para revisión – ${direccion}`;
      cuerpo = `
      <p>Hola ${nombrePropietario},</p>
      <p>Tu asesor inmobiliario ha preparado el contrato de arrendamiento de la propiedad ubicada en <strong>${direccion}</strong>.</p>
      <p> Por favor revisa el documento en el siguiente enlace:</p>
      <p> <a href="${link}" target="_blank">Ver contrato de arrendamiento</a></p>
      <p>Acciones disponibles:  Aprobar contrato | ✏ Solicitar ajustes | ☎ Contactar a mi agente</p>
      <p>Tu respuesta se registrará en la línea de tiempo y permitirá avanzar al siguiente paso en el proceso.</p>
    `;
    }

    return { asunto, cuerpo };
  }


  envioBorradorComprador(
    nombreCliente: string,
    direccion: string,
    link: string
  ) {
    const asunto = `Borrador de contrato de compraventa para revisión – ${direccion}`;
    const cuerpo = `
    <p>Hola ${nombreCliente},</p>
    <p>Tu asesor inmobiliario ha preparado el borrador del contrato de compraventa de la propiedad ubicada en <strong>${direccion}</strong>.</p>
    <p> Revisa el documento en el siguiente enlace:</p>
    <p> <a href="${link}" target="_blank">Ver borrador de compraventa</a></p>
    <p>Acciones disponibles:  Aprobar contrato | ✏ Solicitar ajustes | ☎ Contactar a mi agente</p>
  `;
    return { asunto, cuerpo };
  }

  envioBorradorInquilino(
    nombreInquilino: string,
    direccion: string,
    link: string
  ) {
    const asunto = `Contrato de arrendamiento para revisión – ${direccion}`;
    const cuerpo = `
    <p>Hola ${nombreInquilino},</p>
    <p>Tu asesor inmobiliario ha preparado el contrato de arrendamiento de la propiedad ubicada en <strong>${direccion}</strong>.</p>
    <p> Revisa el documento en el siguiente enlace:</p>
    <p> <a href="${link}" target="_blank">Ver contrato de arrendamiento</a></p>
    <p>Acciones disponibles:  Aprobar contrato | ✏ Solicitar ajustes | ☎ Contactar a mi agente</p>
    <p>Tu respuesta quedará registrada y permitirá continuar al siguiente paso: firma de contrato.</p>
  `;
    return { asunto, cuerpo };
  }

  proyectoDisponibleAsesor(
    tipo: 'venta' | 'renta',
    nombreAsesor: string,
    direccion: string
  ) {
    let asunto = '';
    let cuerpo = '';

    if (tipo === 'venta') {
      asunto = `Proyecto de notaría disponible – ${direccion}`;
      cuerpo = `
      <p>Hola ${nombreAsesor},</p>
      <p>El proyecto de notaría para la propiedad <strong>${direccion}</strong> ya está disponible.</p>
      <p> Por favor, reenvía este documento a tu cliente comprador para su revisión y comentarios.</p>
      <p><em>La línea de tiempo se actualizará a “Envío de borrador de contrato compraventa” una vez lo compartas.</em></p>
    `;
    } else {
      asunto = `Contrato de arrendamiento disponible – ${direccion}`;
      cuerpo = `
      <p>Hola ${nombreAsesor},</p>
      <p>El contrato de arrendamiento de la propiedad <strong>${direccion}</strong> ya está disponible.</p>
      <p> Reenvíalo a tu cliente inquilino para revisión y comentarios.</p>
      <p><em>La línea de tiempo se actualizará a “Envío borrador contrato de arrendamiento para revisión” una vez lo compartas.</em></p>
    `;
    }

    return { asunto, cuerpo };
  }

  fechaFirmaCompraventaComprador(
    nombreCliente: string,
    direccion: string,
    fechaHora: string,
    nombreAsesor: string
  ) {
    const asunto = `Fecha de firma de contrato de compraventa – ${direccion}`;
    const cuerpo = `
    <p>Hola ${nombreCliente},</p>
    <p>El contrato de compraventa de la propiedad <strong>${direccion}</strong> ha sido aprobado por ambas partes.</p>
    <p> La firma quedó programada para el <strong>${fechaHora}</strong>.</p>
    <p>Tu asesor ${nombreAsesor} te acompañará en este paso.</p>
  `;
    return { asunto, cuerpo };
  }


  fechaFirmaArrendamientoInquilino(
    nombreInquilino: string,
    direccion: string,
    fechaHora: string,
    nombreAsesor: string
  ) {
    const asunto = `Fecha de firma de contrato de arrendamiento – ${direccion}`;
    const cuerpo = `
    <p>Hola ${nombreInquilino},</p>
    <p>El contrato de arrendamiento de la propiedad <strong>${direccion}</strong> ha sido aprobado por ambas partes.</p>
    <p> La firma quedó programada para el <strong>${fechaHora}</strong> en la ubicación acordada.</p>
    <p>Tu asesor ${nombreAsesor} te acompañará en este paso.</p>
  `;
    return { asunto, cuerpo };
  }

  fechaFirmaPropietario(
    tipo: 'venta' | 'renta',
    nombrePropietario: string,
    direccion: string,
    fechaHora: string,
    nombreAsesor: string
  ) {
    let asunto = '';
    let cuerpo = '';

    if (tipo === 'venta') {
      asunto = `Fecha de firma de contrato de compraventa – ${direccion}`;
      cuerpo = `
      <p>Hola ${nombrePropietario},</p>
      <p>El contrato de compraventa de tu propiedad en <strong>${direccion}</strong> está listo para firma.</p>
      <p> La cita quedó programada para el <strong>${fechaHora}</strong> en la ubicación seleccionada.</p>
      <p>Tu asesor ${nombreAsesor} confirmará los detalles finales.</p>
    `;
    } else {
      asunto = `Fecha de firma de contrato de arrendamiento – ${direccion}`;
      cuerpo = `
      <p>Hola ${nombrePropietario},</p>
      <p>El contrato de arrendamiento de tu propiedad en <strong>${direccion}</strong> está listo para firma.</p>
      <p> La cita quedó programada para el <strong>${fechaHora}</strong> en la ubicación acordada.</p>
      <p>Tu asesor ${nombreAsesor} confirmará los detalles finales.</p>
    `;
    }

    return { asunto, cuerpo };
  }

  ventanaEmergenteProcesoConcluido(
    tipoContrato: 'Contrato de Arrendamiento' | 'Contrato de Compraventa',
    direccion: string
  ) {
    const asunto = 'Proceso concluido – Firma realizada';
    const cuerpo = `
    <h3> Proceso concluido – Firma realizada</h3>
    <p>La fecha de firma del <strong>${tipoContrato}</strong> para la propiedad <strong>${direccion}</strong> ha pasado.</p>
    <p>El sistema cerrará la línea de tiempo con estatus <em>“Operación cerrada”</em> y registrará la fecha de cierre en el directorio correspondiente:</p>
    <ul>
      <li> Directorio Propietarios (si llevas al propietario)</li>
      <li> Directorio Clientes (si llevas al inquilino/comprador)</li>
    </ul>
    <p><em>Acciones disponibles:</em>  Confirmar cierre |  Ver directorio actualizado</p>
  `;
    return { asunto, cuerpo };
  }

  ventanaEmergenteClasificacionDocumento(tipoDoc: string, idPropiedad: string) {
    const asunto = 'Clasificación de documento';
    const cuerpo = `
    <p> Has clasificado un <strong>${tipoDoc}</strong> de la propiedad <strong>${idPropiedad}</strong>.</p>
    <p>¿A quién deseas enviar este documento para revisión?</p>
    <p><strong>Opciones:</strong></p>
    <ul>
      <li>Propietario</li>
      <li>Cliente comprador</li>
      <li>Inquilino</li>
      <li>Asesor en colaboración</li>
    </ul>
    <p><em>Acciones disponibles:</em>  Enviar documento |  Guardar para después |  Cancelar</p>
  `;
    return { asunto, cuerpo };
  }

  documentoDisponibleCliente(
    nombreCliente: string,
    direccion: string,
    tipoDoc: 'Proyecto de notaría' | 'Contrato de arrendamiento',
    link: string
  ) {
    const asunto = `Documento disponible para revisión – ${direccion}`;
    const cuerpo = `
    <p>Hola ${nombreCliente},</p>
    <p>Tu asesor inmobiliario te envía el <strong>${tipoDoc}</strong> de la propiedad <strong>${direccion}</strong>.</p>
    <p> Revisa el documento en el siguiente enlace:</p>
    <p> <a href="${link}" target="_blank">Ver documento</a></p>
    <p>Acciones disponibles:  Aprobar | ✏ Solicitar ajustes | ☎ Contactar a mi agente</p>
  `;
    return { asunto, cuerpo };
  }

  documentoDisponiblePropietario(
    nombrePropietario: string,
    direccion: string,
    tipoDoc: 'Proyecto de notaría' | 'Contrato de arrendamiento',
    link: string
  ) {
    const asunto = `Documento disponible para revisión – ${direccion}`;
    const cuerpo = `
    <p>Hola ${nombrePropietario},</p>
    <p>El <strong>${tipoDoc}</strong> de tu propiedad en <strong>${direccion}</strong> ya está listo para revisión.</p>
    <p> Revisa el documento en este enlace:</p>
    <p> <a href="${link}" target="_blank">Ver documento</a></p>
    <p>Acciones disponibles:  Aprobar | ✏ Solicitar ajustes | ☎ Contactar a mi agente</p>
  `;
    return { asunto, cuerpo };
  }

  documentoCompartidoAsesorColaboracion(
    nombreAsesorColab: string,
    nombreAsesorPrincipal: string,
    tipoDoc: 'Proyecto de notaría' | 'Contrato de arrendamiento',
    idPropiedad: string,
    direccion: string
  ) {
    const asunto = `Documento compartido para tu operación en colaboración – ${direccion}`;
    const cuerpo = `
    <p>Hola ${nombreAsesorColab},</p>
    <p>El asesor <strong>${nombreAsesorPrincipal}</strong> compartió el <strong>${tipoDoc}</strong> de la propiedad <strong>${idPropiedad}</strong> ubicada en ${direccion}.</p>
    <p> Por favor, reenvíalo a tu cliente para revisión.</p>
    <p><em>La línea de tiempo se actualizó a “Revisión de proyecto”.</em></p>
  `;
    return { asunto, cuerpo };
  }

  ventanaEmergenteProcesoConcluidoCompraventa(direccion: string) {
    const asunto = 'Proceso concluido – Firma realizada';
    const cuerpo = `
    <h3> Proceso concluido – Firma realizada</h3>
    <p>La fecha de firma del contrato de <strong>compraventa</strong> para la propiedad <strong>${direccion}</strong> ha concluido.</p>
    <p> El sistema cerrará la línea de tiempo con estatus <em>“Operación cerrada”</em> y registrará la fecha de cierre en el directorio correspondiente:</p>
    <ul>
      <li> Directorio Propietarios (si llevas al propietario)</li>
      <li> Directorio Clientes (si llevas al comprador)</li>
    </ul>
    <p><em>Acciones disponibles:</em>  Confirmar cierre |  Ver directorio actualizado</p>
  `;
    return { asunto, cuerpo };
  }

  notificacionCierreFirma(
    tipo: 'propietario' | 'comprador',
    direccion: string
  ) {
    const asunto = 'Firma concluida – Operación cerrada';
    const cuerpo =
      tipo === 'propietario'
        ? `
        <p> La firma en <strong>${direccion}</strong> concluyó.</p>
        <p> Línea cerrada y fecha registrada en Directorio de Propietarios y Clientes.</p>
      `
        : `
        <p> La firma en <strong>${direccion}</strong> concluyó.</p>
        <p> Línea cerrada y fecha registrada en Directorio de Clientes.</p>
      `;
    return { asunto, cuerpo };
  }

  ventanaEmergentePagoComision(idPropiedad: string) {
    const asunto = 'Pago de comisión pendiente';
    const cuerpo = `
    <h3> Pago de comisión pendiente</h3>
    <p>El proceso de la propiedad <strong>${idPropiedad}</strong> ha concluido.</p>
    <p> Genera el formato de pago de comisión al asesor con el que realizaste la operación.</p>
    <p><em>Acciones disponibles:</em>  Elaborar formato |  Cerrar</p>
  `;
    return { asunto, cuerpo };
  }
}
