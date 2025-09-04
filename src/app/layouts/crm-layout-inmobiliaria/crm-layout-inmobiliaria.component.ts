import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

type HeaderKey =
  | 'dashboard'
  | 'bandeja'
  | 'perfil'
  | 'clientes'
  | 'propiedades'
  | 'recorridos'
  | 'agentes';

@Component({
  selector: 'app-crm-layout-inmobiliaria',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './crm-layout-inmobiliaria.component.html',
  styleUrls: ['./crm-layout-inmobiliaria.component.scss']
})
export class CrmLayoutInmobiliariaComponent {
  fotoPerfil = 'https://via.placeholder.com/100';
  nombreUsuario = 'Inmobiliaria XYZ';
  rolUsuario = 'Admin';

  constructor(private router: Router) {}

  headerSections: Record<HeaderKey, string[]> = {
    dashboard: ['grafica-cierres', 'grafica-propiedades', 'panel-general'],
    bandeja: ['mensajes-clientes', 'mensajes-asesores'],
    perfil: ['perfil-asesor', 'citas-programadas'],
    clientes: ['seguimiento-cliente', 'directorio-clientes', 'favoritos-clientes'],
    propiedades: ['listado-propiedades', 'kpis-lead', 'propiedades-colaboracion'],
    recorridos: ['recorridos-programados'],
    agentes: ['requerimientos', 'directorio-agentes', 'colaboracion-agentes', 'all-media']
  };

  isActiveHeader(seccion: HeaderKey): boolean {
    const url = this.router.url;
    return this.headerSections[seccion].some((path: string) => url.includes(path));
  }
}
