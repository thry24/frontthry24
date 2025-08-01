import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfPropiedadService {
  async generarPDF(propiedad: any, opcion: 'asesor' | 'usuario' | 'ninguno', usuarioActivo: any = null) {
    if (!propiedad || !propiedad.clave) {
      console.error('Propiedad inválida, no se puede generar el PDF.');
      return;
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

      const content: any[] = [
        ...(opcion !== 'ninguno'
  ? [
      {
        columns: [
          {
            width: '*',
            stack: [
              {
                text: agente?.nombre || 'Nombre no disponible',
                style: 'contactoNombre',
              },
              {
                text: agente?.correo || 'Correo no disponible',
                style: 'contactoInfo',
              },
              {
                text: agente?.telefono || 'Tel. no disponible',
                style: 'contactoInfo',
              },
            ],
          },
          ...(opcion === 'asesor' && logoBase64
            ? [
                {
                  width: 55,
                  image: logoBase64,
                  fit: [55, 55],
                  alignment: 'right',
                  margin: [0, 0, 0, 0],
                },
              ]
            : []),
        ],
        margin: [0, 0, 0, 10],
      },
    ]
  : []),


        {
          text: titulo,
          style: 'titulo',
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },

        {
          text: `Clave de la propiedad: ${propiedad.clave}`,
          style: 'subheader',
          margin: [0, 5, 0, 0],
        },
        {
          text: `Dirección: ${direccion.calle || ''} ${
            direccion.numero || ''
          }, ${direccion.colonia || ''}, ${direccion.municipio || ''}, ${
            direccion.estado || ''
          }`,
          margin: [0, 0, 0, 10],
        },
        {
          text: `Precio: ${precio}`,
          style: 'subheader',
          margin: [0, 0, 0, 5],
        },
        ...(imagenPrincipalBase64 || mapaBase64
          ? [
              {
                columns: [
                  {
                    width: '60%',
                    stack: [
                      {
                        image: imagenPrincipalBase64,
                        fit: [300, 220],
                        alignment: 'center',
                        margin: [0, 0, 0, 10],
                      },
                    ],
                  },

                  {
                    width: '40%',
                    stack: [
                      {
                        image:
                          imagenesBase64.length > 0
                            ? imagenesBase64[0]
                            : imagenPrincipalBase64,
                        fit: [200, 100],
                        alignment: 'center',
                        margin: [0, 0, 0, 5],
                      },

                      ...(mapaBase64
                        ? [
                            {
                              image: mapaBase64,
                              fit: [200, 100],
                              alignment: 'center',
                            },
                          ]
                        : []),
                    ],
                  },
                ],
                columnGap: 10,
                margin: [0, 10, 0, 10],
              },
            ]
          : []),

        ...(propiedad.descripcion
          ? [
              {
                text: 'Descripción:',
                style: 'subheader',
                margin: [0, 10, 0, 3],
              },
              {
                text: propiedad.descripcion,
                style: 'descripcion',
                alignment: 'justify',
                margin: [0, 0, 0, 10],
              },
            ]
          : []),

        {
          alignment: 'center',
          margin: [0, 10, 0, 10],
          columns: [
            {
              width: '25%',
              stack: this.obtenerCaracteristicas(propiedad),
            },
            {
              width: '25%',
              stack: this.obtenerSeccion('Generales', propiedad.generales, {
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
              }),
            },
            {
              width: '25%',
              stack: this.obtenerSeccion('Amenidades', propiedad.amenidades, {
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
              }),
            },
            {
              width: '25%',
              stack: this.obtenerSeccion('Servicios', propiedad.servicios, {
                tipoGas: 'Gas',
                internet: 'Internet',
                telefonia: 'Telefonía',
                tv: 'TV por cable',
                enchufeCarros: 'Enchufe para autos eléctricos',
              }),
            },
          ],
          columnGap: 10,
        },
        // Agrega al final del array `content`
        ...(imagenesBase64.length > 1
          ? [
              { text: '', pageBreak: 'before' }, // Fuerza nueva hoja

              {
                text: 'Galería de imágenes',
                style: 'subheader',
                alignment: 'center',
                margin: [0, 0, 0, 10],
              },

              {
                layout: 'noBorders',
                table: {
                  widths: this.generarDistribucionColumnas(
                    imagenesBase64.length - 1
                  ),
                  body: this.generarCeldasGaleria(imagenesBase64.slice(1, 7)), // Solo las 6 siguientes
                },
              },
            ]
          : []),
      ];

      const docDefinition = {
        pageMargins: [40, 40, 40, 40],
        content,
        footer: (currentPage: number, pageCount: number) => {
          return {
            margin: [0, 10],
            columns: [
              { width: '*', text: '' },
              {
                width: 'auto',
                alignment: 'center',
                margin: [0, 0, 0, 0],
                columns: [
                  {
                    image: propiedad.logoAi24Base64,
                    width: 25,
                    margin: [0, 0, 5, 0],
                  },
                  {
                    text: 'Generado por Ai24',
                    fontSize: 8,
                    color: '#888888',
                    margin: [0, 6, 0, 0],
                  },
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
          descripcion: {
            fontSize: 9,
            color: '#333',
            lineHeight: 1.2,
          },
          caracteristicas: {
            fontSize: 9,
            color: '#333',
          },
        },
      };

      pdfMake.createPdf(docDefinition).download(`ficha-${propiedad.clave}.pdf`);
    } catch (error) {
      console.error('Error generando el PDF:', error);
    }
  }
  private generarDistribucionColumnas(cantidad: number): string[] {
    if (cantidad === 1) return ['*'];
    if (cantidad === 2) return ['50%', '50%'];
    if (cantidad === 3) return ['33%', '33%', '33%'];
    if (cantidad >= 4) return ['33%', '33%', '33%'];
    return ['*'];
  }
  private generarCeldasGaleria(imagenes: string[]): any[][] {
    const filas: any[][] = [];
    const columnasPorFila = this.generarDistribucionColumnas(
      imagenes.length
    ).length;

    for (let i = 0; i < imagenes.length; i += columnasPorFila) {
      const fila: any[] = [];

      for (let j = 0; j < columnasPorFila; j++) {
        const img = imagenes[i + j];
        if (img) {
          fila.push({
            image: img,
            fit: [180, 150],
            alignment: 'center',
            margin: [5, 5, 5, 5],
          });
        } else {
          fila.push('');
        }
      }

      filas.push(fila);
    }

    return filas;
  }

  public obtenerMapaBase64(lat: number, lng: number): Promise<string | null> {
    return new Promise((resolve) => {
      if (!lat || !lng) return resolve(null);

      const apiKey = 'AIzaSyDVypu6PUsa0dSj5P4Nyw6pOgB0gM10gIY';
      const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=600x300&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

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

  private obtenerCaracteristicas(propiedad: any): any[] {
    const tipoPropiedad = propiedad.tipoPropiedad;
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

    const key = tipoCaracteristicas[tipoPropiedad];
    const caracteristicas = propiedad.caracteristicas?.[key];

    if (!caracteristicas || typeof caracteristicas !== 'object') return [];

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

    const items = Object.entries(caracteristicas)
      .filter(
        ([_, valor]) =>
          valor !== false &&
          valor !== null &&
          valor !== '' &&
          valor !== undefined
      )
      .slice(0, 10)
      .map(([clave, valor]) => {
        const nombre = traducciones[clave] || clave;
        let textoValor: string;

        if (typeof valor === 'boolean') {
          textoValor = 'Sí';
        } else if (
          typeof valor === 'number' &&
          /m2|superficie|metros|construccion/i.test(clave)
        ) {
          textoValor = `${valor} m²`;
        } else {
          textoValor = String(valor);
        }

        return `${nombre}: ${textoValor}`;
      });

    if (!items.length) return [];

    return [
      { text: 'Características', style: 'subheader', margin: [0, 10, 0, 5] },
      { ul: items, style: 'caracteristicas', margin: [0, 0, 0, 10] },
    ];
  }

  private obtenerSeccion(
    nombre: string,
    datos: any,
    traducciones: { [key: string]: string }
  ): any[] {
    if (!datos || typeof datos !== 'object') return [];

    const items = Object.entries(datos)
      .filter(
        ([_, valor]) =>
          valor !== false &&
          valor !== null &&
          valor !== '' &&
          valor !== undefined
      )
      .map(([clave, valor]) => {
        const nombreCampo = traducciones[clave] || clave;
        let textoValor: string;

        if (typeof valor === 'boolean') {
          textoValor = 'Sí';
        } else if (
          typeof valor === 'number' &&
          /m2|superficie|metros|construccion/i.test(clave)
        ) {
          textoValor = `${valor} m²`;
        } else {
          textoValor = String(valor);
        }

        return `${nombreCampo}: ${textoValor}`;
      });

    if (!items.length) return [];

    return [
      { text: nombre, style: 'subheader', margin: [0, 10, 0, 5] },
      { ul: items, style: 'caracteristicas', margin: [0, 0, 0, 10] },
    ];
  }
}
