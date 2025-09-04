import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-kpis-lead',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './kpis-lead.page.html',
  styleUrls: ['./kpis-lead.page.scss']
})
export class KpisLeadPage {
  datosKPI = [
    {
      fecha: '12-marzo-2025',
      tipo: 'casa',
      id: 'AI-232233',
      imagen: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      leads: 12,
      vistas: 3,
      colonia: 'juriquilla santa fe',
      zona: 'juriquilla',
      costo: 'Pendiente'
    },
    {
      fecha: '10-marzo-2025',
      tipo: 'departamento',
      id: 'AI-212311',
      imagen: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
      leads: 7,
      vistas: 5,
      colonia: 'centro histórico',
      zona: 'centro',
      costo: 'Pendiente'
    }
  ];
}
