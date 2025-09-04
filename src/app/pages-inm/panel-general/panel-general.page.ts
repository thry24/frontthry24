import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel-general',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './panel-general.page.html',
  styleUrls: ['./panel-general.page.scss']
})
export class PanelGeneralPage implements OnInit {
  kpis = [
    { titulo: 'Leads', valor: '5,250', porcentaje: 81 },
    { titulo: 'Propiedades', valor: '175', porcentaje: 89 },
    { titulo: 'Clientes Totales', valor: '10,500', porcentaje: 87.5 },
    { titulo: 'Comisiones', valor: '$135M', porcentaje: 90 }
  ];

  asesores = [
    { nombre: 'Jessica Morgan', ventas: 90, rentas: 40, total: '$2.5M', img: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { nombre: 'Michael Bennett', ventas: 85, rentas: 40, total: '$2.3M', img: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { nombre: 'Daniel Rivera', ventas: 100, rentas: 50, total: '$2.1M', img: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { nombre: 'Sophie Turner', ventas: 95, rentas: 35, total: '$1.9M', img: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { nombre: 'Amber Scott', ventas: 70, rentas: 30, total: '$1.7M', img: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { nombre: 'Zain Bator', ventas: 90, rentas: 25, total: '$1.6M', img: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { nombre: 'Jordyn Westervelt', ventas: 50, rentas: 45, total: '$1.5M', img: 'https://randomuser.me/api/portraits/women/7.jpg' }
  ];

  tiposProp = [
    { tipo: 'House', cantidad: 1514, porcentaje: 40 },
    { tipo: 'Apartment', cantidad: 757, porcentaje: 20 },
    { tipo: 'Villa', cantidad: 606, porcentaje: 15 },
    { tipo: 'Townhouse', cantidad: 454, porcentaje: 12 },
    { tipo: 'Office', cantidad: 303, porcentaje: 8 },
    { tipo: 'Others', cantidad: 152, porcentaje: 5 }
  ];

  totalPropiedades = 3786;

  banners = [
    {
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      precio: '$1.2M',
      titulo: 'Parkside Residence',
      ubicacion: 'Brooklyn, New York',
      rating: '⭐ 4.7/5, 220 reviews',
      vistas: '38,000'
    },
    {
      img: 'https://images.unsplash.com/photo-1600585154515-3e9a8abf2ba4',
      precio: '$3,200/month',
      titulo: 'Downtown Loft Apartment',
      ubicacion: 'Seattle, Washington',
      rating: '⭐ 4.7/5, 210 reviews',
      vistas: '41,000'
    }
  ];

  constructor() {}

  ngOnInit() {}

  verSeguimiento(asesor: any) {
    console.log('Abrir seguimiento de:', asesor.nombre);
    // Aquí puede redirigir a una ruta con router.navigate(['seguimiento', asesor.id]) si se requiere.
  }
}
