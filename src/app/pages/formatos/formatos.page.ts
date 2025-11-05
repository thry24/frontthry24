import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { PDFDocument, rgb } from 'pdf-lib';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

type TipoCliente = 'Comprador' | 'Arrendador' | 'Propietario' | 'Colaboración';

interface FormatoItem {
  titulo: string;
  archivo: string;      // ruta o dataURL
  tipo: TipoCliente;
  // metadatos opcionales para reemplazos
  _updatedAt?: number;
  _uploadedName?: string;
  _uploadedMime?: string;
}
const user = JSON.parse(localStorage.getItem('user') || '{}');
const logoUrl = user.fotoPerfil || 'assets/logo-thry24';
type UploadRecord = {
  titulo: string;
  name: string;
  mime: string;
  dataUrl: string; // archivo como DataURL
  updatedAt: number;
};

const LS_KEY = 'thry24_formatos_uploads_v1';

@Component({
  selector: 'app-formatos',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './formatos.page.html',
  styleUrls: ['./formatos.page.scss']
})
export class FormatosPage {

  @ViewChild('uploader') uploaderRef!: ElementRef<HTMLInputElement>;
  private uploadTarget?: FormatoItem;

  tipos: TipoCliente[] = ['Comprador', 'Arrendador', 'Propietario', 'Colaboración'];

  formatos: FormatoItem[] = [
    { titulo: 'Carta Oferta Compra', archivo: 'assets/formatos/Carta Oferta Compra.docx', tipo: 'Comprador' },
    { titulo: 'Recibo Llaves Para Promoción de Inmueble', archivo: 'assets/formatos/Recibo Llaves Para Promocion de Inmueble.docx', tipo: 'Propietario' },
    { titulo: 'Recepción de Inmueble Inquilino - Asesor Inmobiliario', archivo: 'assets/formatos/Recepcion de Inmueble Inquilino - Asesor Inmobili....docx', tipo: 'Arrendador' },
    { titulo: 'Checklist Documentación Propiedad', archivo: 'assets/formatos/Checklist Documentacion Propiedad.docx', tipo: 'Propietario' },
    { titulo: 'Recepción de Llaves Inquilino - Asesor Inmobiliario', archivo: 'assets/formatos/Recepcion de Llaves Inquilino - Asesor Inmobil....docx', tipo: 'Arrendador' },
    { titulo: 'Entrega Inmueble Amueblado Asesor - Arrendatario', archivo: 'assets/formatos/Entrega Inmueble Amueblado Asesor - Arrendata....docx', tipo: 'Arrendador' },
    { titulo: 'Carta Oferta Renta', archivo: 'assets/formatos/Carta Oferta Renta.docx', tipo: 'Arrendador' },
    { titulo: 'Entrega Inmueble Sin Amueblar Asesor Inmobiliario', archivo: 'assets/formatos/Entrega Inmueble Sin Amueblar Asesor Inmobiliar....docx', tipo: 'Arrendador' },
    { titulo: 'Checklist Documentación Cliente Comprador', archivo: 'assets/formatos/Checklist Documentacion Cliente Comprador - Ar....docx', tipo: 'Comprador' },
    { titulo: 'Pago Comisión Propietario–Asesor', archivo: 'assets/formatos/Pago Comision Propietario-Asesor.docx', tipo: 'Propietario' },
    { titulo: 'Pago Comisión En Colaboración', archivo: 'assets/formatos/Pago Comision En Colaboracion.docx', tipo: 'Colaboración' },
  ];

  constructor(private toast: ToastController) {
    this.restaurarUploads();
  }

  /* ================== Helpers UI ================== */

  private async toastMsg(message: string) {
    const t = await this.toast.create({ message, duration: 1700, position: 'bottom' });
    await t.present();
  }

  /* ================== Descargar (PDF/DOCX) ================== */

  generarPDF(item: FormatoItem) {
    // Si el usuario subió algo, item.archivo será un dataURL -> se descarga tal cual
    // Si no, es la ruta original dentro de assets.
    const baseName =
      (item._uploadedName?.replace(/\.(docx|doc|pdf)$/i, '') || item.titulo).trim();

    // Detectamos extensión preferente según upload o dejamos .docx
    const ext = item._uploadedMime?.includes('pdf') ? 'pdf'
              : item._uploadedMime?.includes('msword') || item._uploadedMime?.includes('officedocument') ? 'docx'
              : item.archivo.startsWith('data:application/pdf') ? 'pdf'
              : 'docx';

    const a = document.createElement('a');
    a.href = item.archivo; // puede ser ruta o dataURL
    a.download = `${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    this.toastMsg('Descargando formato…');
  }

  /* ================== Compartir ================== */

  compartir(item: FormatoItem) {
    const isDataUrl = item.archivo.startsWith('data:');

    // Si es DataURL, creamos un Blob y un objectURL temporal para compartir
    let shareUrl = '';
    if (isDataUrl) {
      try {
        const blob = this.dataURLtoBlob(item.archivo);
        const objUrl = URL.createObjectURL(blob);
        shareUrl = objUrl;
        // Nota: muchos navegadores no permiten share con blob URLs.
      } catch {
        shareUrl = window.location.href; // fallback
      }
    } else {
      shareUrl = window.location.origin + '/' + item.archivo;
    }

    const titulo = `Formato: ${item.titulo}`;
    const texto = `Te comparto el formato "${item.titulo}" de Thry24${isDataUrl ? '' : ':\n' + shareUrl}`;

    if (navigator.share) {
      navigator.share({ title: titulo, text: texto, url: isDataUrl ? undefined : shareUrl }).catch(() => {});
    } else {
      // Fallback a correo
      const body = isDataUrl
        ? `${texto}\n\n(Nota: este adjunto es local. Descárgalo desde la app.)`
        : texto;
      const mailto = `mailto:?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    }
  }

  /* ================== Subir (simulado) ================== */

  subir(item: FormatoItem) {
    this.uploadTarget = item;
    if (this.uploaderRef?.nativeElement) {
      this.uploaderRef.nativeElement.value = ''; // reset
      this.uploaderRef.nativeElement.click();
    }
  }

  async onFilePicked(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.uploadTarget) return;

    // Validamos tipo
    const okTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword',                                                     // .doc
      'application/pdf'
    ];
    if (!okTypes.includes(file.type)) {
      this.toastMsg('Formato no soportado. Sube .docx o .pdf');
      return;
    }

    // Lo convertimos a DataURL para persistir sin backend
    const dataUrl = await this.readAsDataUrl(file);
    // Reemplazamos en la lista visual
    const tgt = this.uploadTarget;
    tgt.archivo = dataUrl;
    tgt._uploadedName = file.name;
    tgt._uploadedMime = file.type;
    tgt._updatedAt = Date.now();

    // Persistimos en localStorage
    const record: UploadRecord = {
      titulo: tgt.titulo,
      name: file.name,
      mime: file.type,
      dataUrl,
      updatedAt: tgt._updatedAt
    };
    this.guardarUpload(record);

    this.uploadTarget = undefined;
    this.toastMsg('Formato actualizado localmente.');
  }

  /* ================== Persistencia local ================== */

  private guardarUpload(r: UploadRecord) {
    const arr = this.leerUploads();
    const idx = arr.findIndex(x => x.titulo === r.titulo);
    if (idx >= 0) arr[idx] = r; else arr.push(r);
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  }

  private leerUploads(): UploadRecord[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as UploadRecord[]) : [];
    } catch {
      return [];
    }
  }

  private restaurarUploads() {
    const uploads = this.leerUploads();
    if (!uploads.length) return;
    for (const up of uploads) {
      const item = this.formatos.find(f => f.titulo === up.titulo);
      if (item) {
        item.archivo = up.dataUrl;
        item._uploadedName = up.name;
        item._uploadedMime = up.mime;
        item._updatedAt = up.updatedAt;
      }
    }
  }

  /* ================== Utils ================== */

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  private dataURLtoBlob(dataUrl: string): Blob {
    const [header, data] = dataUrl.split(',');
    const mime = header.match(/data:(.*);base64/)?.[1] || 'application/octet-stream';
    const binary = atob(data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  async generarCartaOfertaCompra(seguimiento: any) {
  try {
    // 1️⃣ Cargar plantilla base desde /assets
    const response = await fetch('assets/formatos/Carta Oferta Compra.docx');
    const content = await response.arrayBuffer();
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // 2️⃣ Obtener agente (usuario actual)
    const agente = JSON.parse(localStorage.getItem('user') || '{}');

    // 3️⃣ Obtener cliente desde seguimiento (por correo o relación)
    const cliente = {
      nombre: seguimiento.clienteNombre,
      email: seguimiento.clienteEmail,
      telefono: seguimiento.clienteTelefono || '',
    };

    // 4️⃣ Obtener propiedad asociada
    let propiedad: any = {};
    if (seguimiento.propiedadId) {
      const propRes = await fetch(`${environment.apiUrl}/propiedades/${seguimiento.propiedadId}`);
      propiedad = await propRes.json();
      propiedad = {
        nombre: propiedad.titulo || '',
        tipoPropiedad: propiedad.tipoPropiedad || '',
        direccion: propiedad.direccion?.calle || '',
        clave: propiedad.clave || '',
        precio: propiedad.precio || 0,
        datosPropietario: propiedad.datosPropietario || {},
      };
    }

    // 5️⃣ Rellenar los placeholders del Word
    doc.render({
      agente,
      cliente,
      propiedad,
      seguimiento,
    });

    // 6️⃣ Generar el archivo final
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // 7️⃣ Descargar
    saveAs(out, `Carta Oferta - ${cliente.nombre}.docx`);

  } catch (err) {
    console.error('❌ Error generando carta oferta:', err);
    alert('Error al generar formato.');
  }
}
}
