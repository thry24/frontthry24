import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-requerimientos',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './requerimientos.page.html',
  styleUrls: ['./requerimientos.page.scss']
})
export class RequerimientosPage {
  requerimientos = [
    {
      fotoAgente: 'https://randomuser.me/api/portraits/women/43.jpg',
      tipoOperacion: 'VENTA',
      tipoPropiedad: 'CASA',
      caracteristicas: '3 Habitaciones\n2.5 baños\nJardín, roof garden',
      presupuesto: '$2,000,000 a $2,150,000',
      pagoVenta: 'Crédito Hipotecario',
      pagoRenta: '',
      fechaCierre: new Date('2025-07-15')
    },
    {
      fotoAgente: 'https://randomuser.me/api/portraits/men/52.jpg',
      tipoOperacion: 'RENTA',
      tipoPropiedad: 'DEPARTAMENTO',
      caracteristicas: '2 Habitaciones\n1.5 baños\nBalcón, área de lavado',
      presupuesto: '$10,000 a $12,000 MXN',
      pagoVenta: '',
      pagoRenta: 'Póliza jurídica',
      fechaCierre: new Date('2025-07-30')
    }
  ];
}
