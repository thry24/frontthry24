import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-citas-programadas',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './citas-programadas.page.html',
  styleUrls: ['./citas-programadas.page.scss']
})
export class CitasProgramadasPage implements OnInit {
  citas = [
    {
      nombreAgente: 'Julieta López',
      fotoAgente: 'https://randomuser.me/api/portraits/women/44.jpg',
      idPropiedad: 'AI232-32',
      imgPropiedad: 'https://tse4.mm.bing.net/th/id/OIP.NBtHdYm6anpAXpkgmbL4wAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      tipoOperacion: 'VENTA',
      tipoCliente: 'Cliente directo',
      tipoEvento: 'Recorrido',
      fecha: new Date('2025-04-15'),
      hora: '14:30',
      totalCitas: 4
    },
    {
      nombreAgente: 'Luis Pérez',
      fotoAgente: 'https://randomuser.me/api/portraits/men/46.jpg',
      idPropiedad: 'AI555-11',
      imgPropiedad: 'https://s3.amazonaws.com/propertybase-clients/00D6A000001M17FUAS/a0O8X00000tlR9A/uac0tjsi9/640x321/Beautiful-modern-house-in-condominium-13.jpg',
      tipoOperacion: 'RENTA',
      tipoCliente: 'Asesor externo',
      tipoEvento: 'Firma en notaría',
      fecha: new Date('2025-07-20'),
      hora: '11:00',
      totalCitas: 2
    },
    {
      nombreAgente: 'Daniela Cruz',
      fotoAgente: 'https://randomuser.me/api/portraits/women/55.jpg',
      idPropiedad: 'AI777-99',
      imgPropiedad: 'https://tse1.mm.bing.net/th/id/OIP.0l2iB7ken6nHo-R4SYVzBQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      tipoOperacion: 'VENTA',
      tipoCliente: 'Cliente directo',
      tipoEvento: 'Recolección de documentos',
      fecha: new Date('2025-05-28'),
      hora: '16:00',
      totalCitas: 1
    },
    {
      nombreAgente: 'Carlos Méndez',
      fotoAgente: 'https://randomuser.me/api/portraits/men/48.jpg',
      idPropiedad: 'AI888-66',
      imgPropiedad: 'https://img10.naventcdn.com/avisos/resize/18/00/90/77/01/64/1200x1200/1105139191.jpg?isFirstImage=true',
      tipoOperacion: 'RENTA',
      tipoCliente: 'Asesor interno',
      tipoEvento: 'Recepción de llaves',
      fecha: new Date('2025-04-01'),
      hora: '09:30',
      totalCitas: 3
    },
    {
      nombreAgente: 'Valeria Soto',
      fotoAgente: 'https://randomuser.me/api/portraits/women/62.jpg',
      idPropiedad: 'AI202-88',
      imgPropiedad: 'https://img10.naventcdn.com/avisos-va/vamx-pt10-ads/f1/1200x1200/f1ff87e5-4d75-472b-abd4-60f3872b7f16?isFirstImage=true',
      tipoOperacion: 'VENTA',
      tipoCliente: 'Cliente directo',
      tipoEvento: 'Opcionar propiedad',
      fecha: new Date('2025-04-05'),
      hora: '12:15',
      totalCitas: 1
    }
  ];

  // Filtros
  filtroDia: number | null = null;
  filtroMes: number | null = null;
  filtroAnio: number | null = null;

  // Opciones para selectores
  dias = Array.from({ length: 31 }, (_, i) => i + 1);
  meses = [
    { nombre: 'Enero', value: 0 },
    { nombre: 'Febrero', value: 1 },
    { nombre: 'Marzo', value: 2 },
    { nombre: 'Abril', value: 3 },
    { nombre: 'Mayo', value: 4 },
    { nombre: 'Junio', value: 5 },
    { nombre: 'Julio', value: 6 },
    { nombre: 'Agosto', value: 7 },
    { nombre: 'Septiembre', value: 8 },
    { nombre: 'Octubre', value: 9 },
    { nombre: 'Noviembre', value: 10 },
    { nombre: 'Diciembre', value: 11 }
  ];
  anios = [2025, 2024];

  constructor() {}

  ngOnInit() {}

  citasFiltradas() {
    return this.citas.filter(cita => {
      const fecha = new Date(cita.fecha);
      const diaMatch = this.filtroDia === null || fecha.getDate() === this.filtroDia;
      const mesMatch = this.filtroMes === null || fecha.getMonth() === this.filtroMes;
      const anioMatch = this.filtroAnio === null || fecha.getFullYear() === this.filtroAnio;
      return diaMatch && mesMatch && anioMatch;
    });
  }

  limpiarFiltros() {
    this.filtroDia = null;
    this.filtroMes = null;
    this.filtroAnio = null;
  }
}
