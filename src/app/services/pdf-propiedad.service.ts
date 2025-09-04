import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfPropiedadService {
  async generarPDF(
    propiedad: any,
    opcion: 'asesor' | 'usuario' | 'ninguno',
    usuarioActivo: any = null
  ): Promise<string | null> {
    if (!propiedad || !propiedad.clave) {
      console.error('Propiedad inválida, no se puede generar el PDF.');
      return null;
    }

    let agente: any = {};
    if (opcion === 'usuario' && usuarioActivo) {
      agente = {
        nombre: usuarioActivo.nombre || '',
        correo: usuarioActivo.correo || usuarioActivo.email || '',
        telefono: usuarioActivo.telefono || '',
      };
    } else if (opcion === 'asesor') {
      agente = propiedad.agente || {};
    } else {
      agente = null;
    }

    const direccion = propiedad.direccion || {};

    try {
      const logoBase64 = propiedad.logoBase64;
      const imagenPrincipalBase64 = propiedad.imagenPrincipalBase64;
      const logoAi24Base64 = propiedad.logoAi24Base64 || null;
      const mapaBase64 = propiedad.mapaBase64;
      const imagenesBase64 = propiedad.imagenesBase64 || [];

      const titulo = `${
        propiedad.tipoOperacion === 'venta' ? 'Venta' : 'Renta'
      } de ${propiedad.tipoPropiedad?.toUpperCase() || 'INMUEBLE'}${
        direccion.colonia ? ' en ' + direccion.colonia : ''
      }${direccion.municipio ? ', ' + direccion.municipio : ''}${
        direccion.estado ? ', ' + direccion.estado : ''
      }`;

      const precio = propiedad.precio
        ? new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
          }).format(propiedad.precio)
        : 'No disponible';

      // === Items para secciones ===
      const itemsTipo = this.obtenerCaracteristicasItems(propiedad); // TODAS las del tipo
      const itemsGenerales = this.obtenerSeccionItems(propiedad.generales, {
        cisterna: 'Cisterna',
        hidroneumatico: 'Hidroneumático',
        cancelesBano: 'Canceles de baño',
        riegoAspersion: 'Riego por aspersión',
        calentadorSolar: 'Calentador solar',
        lamparasSolares: 'Lámparas solares',
        aireAcondicionado: 'Aire acondicionado',
        alarma: 'Alarma',
        bodega: 'Bodega',
        calefaccion: 'Calefacción',
        chimenea: 'Chimenea',
        circuitoCerrado: 'Circuito cerrado',
        sistemaInteligente: 'Sistema inteligente',
        elevador: 'Elevador',
        seguridad24h: 'Seguridad 24h',
        vistaPanoramica: 'Vista panorámica',
        vistaFloraFauna: 'Vista flora y fauna',
      }, /* sin límite */);
      const itemsAmenidades = this.obtenerSeccionItems(propiedad.amenidades, {
        juegosInfantiles: 'Juegos infantiles',
        campoGolf: 'Campo de golf',
        gimnasio: 'Gimnasio',
        ludoteca: 'Ludoteca',
        salonEvento: 'Salón de eventos',
        asadores: 'Asadores',
        lagos: 'Lagos',
        petFriendly: 'Pet friendly',
        piscina: 'Piscina',
        jacuzzi: 'Jacuzzi',
        jogging: 'Pista de jogging',
        futbol: 'Cancha de fútbol',
        tenis: 'Cancha de tenis',
        squash: 'Cancha de squash',
        paddle: 'Cancha de paddle',
        basket: 'Cancha de básquet',
        volley: 'Cancha de vóley',
        vistaGolf: 'Vista al campo de golf',
        otros: 'Otros',
      }, /* sin límite */);
      const itemsServicios = this.obtenerSeccionItems(propiedad.servicios, {
        tipoGas: 'Gas',
        internet: 'Internet',
        telefonia: 'Telefonía',
        tv: 'TV por cable',
        enchufeCarros: 'Enchufe para autos eléctricos',
      }, /* sin límite */);

      // === Cuadrícula compacta y sin saltos para la 1a hoja ===
      const cuadriculaTipo = this.construirCuadriculaCaracteristicasTipo(itemsTipo);

      // === Contenido (1a hoja: ficha + características del tipo) ===
      const content: any[] = [
        ...(opcion !== 'ninguno'
          ? [{
              columns: [
                {
                  width: '*',
                  stack: [
                    { text: agente?.nombre || 'Nombre no disponible', style: 'contactoNombre' },
                    { text: agente?.correo || 'Correo no disponible', style: 'contactoInfo' },
                    { text: agente?.telefono || 'Tel. no disponible', style: 'contactoInfo' },
                  ],
                },
                ...(opcion === 'asesor' && logoBase64
                  ? [{ width: 55, image: logoBase64, fit: [55, 55], alignment: 'right', margin: [0,0,0,0] }]
                  : []),
              ],
              margin: [0, 0, 0, 10],
            }]
          : []),

        { text: titulo, style: 'titulo', alignment: 'center', margin: [0, 0, 0, 10] },

        { text: `Clave de la propiedad: ${propiedad.clave}`, style: 'detalleTexto', margin: [0, 5, 0, 0] },
        { text: `Dirección: ${direccion.colonia || ''}, ${direccion.municipio || ''}, ${direccion.estado || ''}`, style: 'detalleTexto', margin: [0, 0, 0, 6] },
        { text: `Precio: ${precio}`, style: 'detalleTexto', margin: [0, 0, 0, 10] },

        ...(imagenPrincipalBase64
          ? [{
              image: imagenPrincipalBase64,
              fit: [460, 260],
              alignment: 'center',
              margin: [0, 0, 0, 8],
            }]
          : []),

        ...(propiedad.descripcion
          ? [
              { text: 'Descripción:', style: 'subheader', margin: [0, 6, 0, 3] },
              { text: propiedad.descripcion, style: 'descripcion', alignment: 'justify', margin: [0, 0, 0, 8] },
            ]
          : []),

        { text: 'Características del inmueble', style: 'encabezadoTabla', alignment: 'center', margin: [0, 4, 0, 6] },
        cuadriculaTipo,

        // Segunda hoja
        { text: '', pageBreak: 'before' },

        { text: 'Detalles adicionales', style: 'subheader', alignment: 'center', margin: [0, 0, 0, 8] },
        this.construirTresTablas(itemsGenerales, itemsAmenidades, itemsServicios),

        // Mapa + lugares (opcional) — lo pongo arriba de la galería
        ...((mapaBase64 || propiedad.conteoLugares)
          ? [{
              margin: [0, 6, 0, 10],
              columns: [
                ...(mapaBase64 ? [{ width: '50%', image: mapaBase64, fit: [260, 160], alignment: 'center' }] : []),
                ...(propiedad.conteoLugares ? [{
                  width: '50%',
                  stack: [
                    { text: 'Lugares cercanos (500m)', bold: true, fontSize: 11, alignment: 'center', margin: [0, 0, 0, 3], color: '#0a2b4a' },
                    { text: 'Explora sitios útiles cerca de esta propiedad:', fontSize: 9, alignment: 'center', margin: [0, 0, 0, 5], color: '#444' },
                    ...this.generarBloquesLugares(propiedad.conteoLugares)
                  ]
                }] : [])
              ],
              columnGap: 10
            }]
          : []),

        // Galería
        ...(imagenesBase64.length > 0
          ? [
              { text: 'Galería de imágenes', style: 'subheader', alignment: 'center', margin: [0, 10, 0, 10] },
              {
                layout: 'noBorders',
                table: {
                  widths: this.generarDistribucionColumnas(imagenesBase64.length),
                  body: this.generarCeldasGaleria(imagenesBase64),
                },
              },
            ]
          : []),
      ];

      const docDefinition = {
        pageMargins: [40, 40, 40, 40],
        content,
        footer: (_currentPage: number, _pageCount: number) => {
          return {
            margin: [0, 10],
            columns: [
              { width: '*', text: '' },
              {
                width: 'auto',
                alignment: 'center',
                margin: [0, 0, 0, 0],
                columns: [
                  ...(logoAi24Base64 ? [{ image: logoAi24Base64, width: 25, margin: [0, 0, 5, 0] }] : []),
                  { text: 'Generado por Ai24', fontSize: 8, color: '#888888', margin: [0, 6, 0, 0] },
                ],
              },
              { width: '*', text: '' },
            ],
          };
        },
        styles: {
          titulo: { fontSize: 20, bold: true, color: '#0a2b4a' },
          subheader: { fontSize: 16, bold: true, color: '#444444' },
          contactoNombre: { fontSize: 11, bold: true, color: '#0a2b4a' },
          contactoInfo: { fontSize: 10, color: '#555' },
          descripcion: { fontSize: 9, color: '#333', lineHeight: 1.2 },
          caracteristicas: { fontSize: 9, color: '#333' },
          detalleTexto: { fontSize: 10, color: '#000000', lineHeight: 1.3, alignment: 'justify' },
          encabezadoTabla: { fontSize: 12, bold: true, color: '#0a2b4a', fillColor: '#f4f7fb', margin: [0, 4, 0, 4], alignment: 'center' },
          tablaTituloCol: { fontSize: 10, bold: true, color: '#444', margin: [0, 0, 0, 4] },
          tablaLabel: { fontSize: 9, color: '#333' },
          tablaValue: { fontSize: 9, bold: true, color: '#0a2b4a' },
          tablaEmpty: { fontSize: 9, color: '#999' },
        },
      };

      const pdf = (pdfMake as any).createPdf(docDefinition);

      const base64: string = await new Promise((resolve) => {
        pdf.getBase64((data: string) => resolve(data));
      });

      pdf.download(`ficha-${propiedad.clave}.pdf`);
      return base64;
    } catch (error) {
      console.error('Error generando el PDF:', error);
      return null;
    }
  }

  // ====== Helpers de layout ======

  // Divide un array en N columnas equilibradas
  private dividirEnColumnas<T>(items: T[], columnas: number): T[][] {
    const colCount = Math.max(1, columnas);
    const porColumna = Math.ceil(items.length / colCount);
    const resultado: T[][] = [];
    for (let i = 0; i < colCount; i++) {
      resultado.push(items.slice(i * porColumna, (i + 1) * porColumna));
    }
    return resultado;
  }

  // Cuadrícula “unbreakable” para las características del TIPO (1a hoja)
  private construirCuadriculaCaracteristicasTipo(
    items: Array<{ label: string; value: string }>
  ) {
    if (!items.length) {
      return { text: '—', style: 'tablaEmpty', margin: [0, 8, 0, 0], unbreakable: true };
    }

    // Heurística de columnas: 1–10 => 2; 11–18 => 3; 19+ => 4
    const cols = items.length <= 10 ? 2 : (items.length <= 18 ? 3 : 4);
    const columnas = this.dividirEnColumnas(items, cols);

    return {
      unbreakable: true,
      margin: [0, 10, 0, 10],
      columns: columnas.map(col => ({
        width: `${Math.floor(100 / cols)}%`,
        table: {
          widths: ['*', 'auto'],
          body: col.map((it, idx) => ([
            { text: it.label, style: 'tablaLabel', fillColor: idx % 2 ? '#fafafa' : '#ffffff' },
            { text: it.value, style: 'tablaValue', alignment: 'right', fillColor: idx % 2 ? '#fafafa' : '#ffffff' }
          ]))
        },
        layout: {
          hLineWidth: () => 0.6,
          vLineWidth: () => 0,
          hLineColor: () => '#ececec',
          paddingTop: () => 4,
          paddingBottom: () => 4,
          paddingLeft: () => 6,
          paddingRight: () => 6
        }
      })),
      columnGap: 10
    };
  }

  // Bloque de TRES TABLAS (Generales, Amenidades, Servicios) para la 2a hoja
  private construirTresTablas(
    generales: Array<{ label: string; value: string }>,
    amenidades: Array<{ label: string; value: string }>,
    servicios: Array<{ label: string; value: string }>
  ) {
    const makeTable = (titulo: string, items: Array<{ label: string; value: string }>) => ([
      { text: titulo, style: 'tablaTituloCol', margin: [0, 0, 0, 6] },
      {
        table: {
          widths: ['*', 'auto'],
          body: items.length
            ? items.map((it, idx) => ([
                { text: it.label, style: 'tablaLabel', fillColor: idx % 2 ? '#fafafa' : '#ffffff' },
                { text: it.value, style: 'tablaValue', alignment: 'right', fillColor: idx % 2 ? '#fafafa' : '#ffffff' }
              ]))
            : [[{ text: '—', colSpan: 2, alignment: 'center', style: 'tablaEmpty' }, {}]]
        },
        layout: {
          hLineWidth: () => 0.6,
          vLineWidth: () => 0,
          hLineColor: () => '#ececec',
          paddingTop: () => 4,
          paddingBottom: () => 4,
          paddingLeft: () => 6,
          paddingRight: () => 6
        }
      }
    ]);

    return {
      margin: [0, 10, 0, 16],
      columns: [
        { width: '33.33%', stack: makeTable('Generales', generales) },
        { width: '33.33%', stack: makeTable('Amenidades', amenidades) },
        { width: '33.33%', stack: makeTable('Servicios', servicios) }
      ],
      columnGap: 10
    };
  }

  // ====== Galería ======
  private generarDistribucionColumnas(cantidad: number): string[] {
    if (cantidad === 1) return ['*'];
    if (cantidad === 2) return ['50%', '50%'];
    if (cantidad === 3) return ['33%', '33%', '33%'];
    if (cantidad >= 4) return ['33%', '33%', '33%'];
    return ['*'];
  }

  private generarCeldasGaleria(imagenes: string[]): any[][] {
    const filas: any[][] = [];
    const columnasPorFila = this.generarDistribucionColumnas(imagenes.length).length;

    for (let i = 0; i < imagenes.length; i += columnasPorFila) {
      const fila: any[] = [];
      for (let j = 0; j < columnasPorFila; j++) {
        const img = imagenes[i + j];
        if (img) {
          fila.push({ image: img, fit: [180, 150], alignment: 'center', margin: [5, 5, 5, 5] });
        } else {
          fila.push({ text: '', margin: [5, 5, 5, 5] });
        }
      }
      filas.push(fila);
    }
    return filas;
  }

  // ====== Mapa estático con radio ======
  public obtenerMapaBase64(lat: number, lng: number): Promise<string | null> {
    return new Promise((resolve) => {
      if (!lat || !lng) return resolve(null);

      const apiKey = 'AIzaSyDVypu6PUsa0dSj5P4Nyw6pOgB0gM10gIY';
      const path = `fillcolor:0xff660088|color:0x00000000|enc:${this.generarPolylineCircular(lat, lng, 250)}`;
      const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=600x300&path=${encodeURIComponent(path)}&key=${apiKey}`;

      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = (err) => {
        console.error('Error cargando imagen del mapa:', url, err);
        resolve(null);
      };

      img.src = url;
    });
  }

  private generarPolylineCircular(lat: number, lng: number, radioMetros: number): string {
    const numPuntos = 32;
    const tierraRadio = 6378137;
    const d = radioMetros / tierraRadio;
    const puntos: { lat: number; lng: number }[] = [];

    for (let i = 0; i <= numPuntos; i++) {
      const angulo = (i * 2 * Math.PI) / numPuntos;
      const latRad = (lat * Math.PI) / 180;
      const lngRad = (lng * Math.PI) / 180;

      const latP = Math.asin(
        Math.sin(latRad) * Math.cos(d) + Math.cos(latRad) * Math.sin(d) * Math.cos(angulo)
      );
      const lngP =
        lngRad +
        Math.atan2(
          Math.sin(angulo) * Math.sin(d) * Math.cos(latRad),
          Math.cos(d) - Math.sin(latRad) * Math.sin(latP)
        );

      puntos.push({ lat: (latP * 180) / Math.PI, lng: (lngP * 180) / Math.PI });
    }

    return this.encodePolyline(puntos);
  }

  private encodePolyline(coordinates: { lat: number; lng: number }[]): string {
    let lastLat = 0;
    let lastLng = 0;
    let result = '';

    for (const point of coordinates) {
      const lat = Math.round(point.lat * 1e5);
      const lng = Math.round(point.lng * 1e5);
      const dLat = lat - lastLat;
      const dLng = lng - lastLng;
      result += this.encodeSignedNumber(dLat) + this.encodeSignedNumber(dLng);
      lastLat = lat;
      lastLng = lng;
    }
    return result;
  }

  private encodeSignedNumber(num: number): string {
    let sgnNum = num << 1;
    if (num < 0) sgnNum = ~sgnNum;
    return this.encodeNumber(sgnNum);
  }

  private encodeNumber(num: number): string {
    let encodeString = '';
    while (num >= 0x20) {
      encodeString += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
      num >>= 5;
    }
    encodeString += String.fromCharCode(num + 63);
    return encodeString;
  }

  private generarBloquesLugares(conteoLugares?: { [tipo: string]: number }): any[] {
    if (!conteoLugares || typeof conteoLugares !== 'object') return [];
    const ordenTipos = ['restaurant', 'school', 'park', 'bus_stop', 'hospital', 'church'];
    return ordenTipos
      .filter((tipo) => conteoLugares[tipo] && conteoLugares[tipo] > 0)
      .map((tipo) => {
        const conteo = conteoLugares[tipo];
        return {
          margin: [0, 2, 0, 2],
          table: {
            widths: ['*', 'auto'],
            body: [[
              { text: tipo.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()), fontSize: 10 },
              { text: conteo >= 9 ? '9+' : conteo.toString(), fontSize: 10, bold: true, color: '#ff6600' },
            ]],
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingTop: () => 4,
            paddingBottom: () => 4,
            paddingLeft: () => 6,
            paddingRight: () => 6,
          },
          fillColor: '#f4f4f4',
          border: [false, false, false, false],
          alignment: 'center',
        };
      });
  }

  // ====== Mapeo de datos → items ======
  private mapDatosAItems(
    datos: any,
    traducciones: { [k: string]: string } = {},
    limit?: number | null
  ): Array<{ label: string; value: string }> {
    if (!datos || typeof datos !== 'object') return [];

    const items = Object.entries(datos)
      .filter(([, valor]) => valor !== false && valor !== null && valor !== '' && valor !== undefined)
      .map(([clave, valor]) => {
        const label = traducciones[clave] || this.formatearClave(clave);
        let value: string;
        if (typeof valor === 'boolean') value = 'Sí';
        else if (typeof valor === 'number' && /m2|superficie|metros|construccion/i.test(clave)) value = `${valor} m²`;
        else value = String(valor);
        return { label, value };
      });

    if (limit && limit > 0) return items.slice(0, limit);
    return items; // sin límite
  }

  private formatearClave(clave: string): string {
    return clave
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // TODAS las características del TIPO de propiedad (sin límite)
  private obtenerCaracteristicasItems(propiedad: any): Array<{ label: string; value: string }> {
    const tipoCaracteristicas: { [key: string]: string } = {
      casa: 'casaDepto',
      departamento: 'casaDepto',
      terreno: 'terreno',
      local: 'local',
      bodega: 'bodega',
      rancho: 'rancho',
      oficina: 'oficina',
      edificio: 'edificio',
    };
    const key = tipoCaracteristicas[propiedad?.tipoPropiedad];
    const caracteristicas = propiedad?.caracteristicas?.[key];

    const traducciones: { [key: string]: string } = {
      habitaciones: 'Habitaciones',
      recamaraPB: 'Recámara en PB',
      banosCompletos: 'Baños Completos',
      mediosBanos: 'Medios Baños',
      estacionamiento: 'Estacionamiento',
      closetVestidor: 'Clóset/Vestidor',
      superficie: 'Superficie',
      construccion: 'Construcción',
      pisos: 'Pisos',
      cocina: 'Cocina',
      barraDesayunador: 'Barra Desayunador',
      balcon: 'Balcón',
      salaTV: 'Sala de TV',
      estudio: 'Estudio',
      areaLavado: 'Área de Lavado',
      cuartoServicio: 'Cuarto de Servicio',
      sotano: 'Sótano',
      jardin: 'Jardín',
      terraza: 'Terraza',
      m2Frente: 'Frente (m)',
      m2Fondo: 'Fondo (m)',
      tipoCentro: 'Tipo de Centro',
      plaza: 'Plaza',
      pasillo: 'Pasillo',
      planta: 'Planta',
      restriccionGiro: 'Restricción de Giro',
      giro: 'Giro Comercial',
      seguridad: 'Seguridad',
      m2Terreno: 'Terreno (m²)',
      m2Construccion: 'Construcción (m²)',
      oficinas: 'Oficinas',
      banos: 'Baños',
      recepcion: 'Recepción',
      mezzanine: 'Mezzanine',
      comedor: 'Comedor',
      andenCarga: 'Andén de Carga',
      rampas: 'Rampas',
      patioManiobras: 'Patio de Maniobras',
      resistenciaPiso: 'Resistencia del Piso',
      recoleccionResiduos: 'Recolección de Residuos',
      subestacion: 'Subestación',
      cargaElectrica: 'Carga Eléctrica',
      kva: 'KVA',
      crossDocking: 'Cross Docking',
      techoLoza: 'Techo de Loza',
      techoLamina: 'Techo de Lámina',
      arcoTecho: 'Arco Techo',
      banosEmpleados: 'Baños para Empleados',
      hectareas: 'Hectáreas',
      uso: 'Uso del Suelo',
      pozo: 'Pozo',
      corrales: 'Corrales',
      casa: 'Casa',
      casco: 'Casco',
      establo: 'Establo',
      invernadero: 'Invernadero',
      bordo: 'Bordo',
      privados: 'Privados',
      salaJuntas: 'Sala de Juntas',
      banosPrivados: 'Baños Privados',
      banosCompartidos: 'Baños Compartidos',
      comedores: 'Comedores',
      empleados: 'N° Empleados',
      corporativo: 'Corporativo',
      m2xPiso: 'm² por Piso',
      pisosEdificio: 'N° de Pisos',
      sistemaIncendios: 'Sistema contra Incendios',
      aguasPluviales: 'Aguas Pluviales',
      aguasNegras: 'Aguas Negras',
      gatosHidraulicos: 'Gatos Hidráulicos',
      autosustentable: 'Autosustentable',
      estacionamientos: 'Estacionamientos',
    };

    return this.mapDatosAItems(caracteristicas, traducciones /* sin límite */);
  }

  // Items de una sección cualquiera (sin límite)
  private obtenerSeccionItems(
    datos: any,
    traducciones: { [key: string]: string },
    limit?: number | null
  ): Array<{ label: string; value: string }> {
    return this.mapDatosAItems(datos, traducciones, limit);
  }
}
