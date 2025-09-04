import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AgenteGuard } from './guards/agente.guard';
import { InmobiliariaGuard } from './guards/inmobiliaria.guard';
import { CrmLayoutComponent } from './components/crm-layout/crm-layout.component';
import { CrmLayoutInmobiliariaComponent } from './layouts/crm-layout-inmobiliaria/crm-layout-inmobiliaria.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'quienes-somos',
    loadChildren: () => import('./pages/quienes-somos/quienes-somos.module').then( m => m.QuienesSomosPageModule)
  },
  {
    path: 'que-es-ai24',
    loadChildren: () => import('./pages/que-es-ai24/que-es-ai24.module').then( m => m.QueEsAi24PageModule)
  },
  {
    path: 'servicios',
    loadChildren: () => import('./pages/servicios/servicios.module').then( m => m.ServiciosPageModule)
  },
  {
    path: 'faqs',
    loadChildren: () => import('./pages/faqs/faqs.module').then( m => m.FaqsPageModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./pages/blog/blog.module').then( m => m.BlogPageModule)
  },
  {
    path: 'privacidad',
    loadChildren: () => import('./pages/privacidad/privacidad.module').then( m => m.PrivacidadPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'agente/agregar',
    loadChildren: () => import('./pages/agente/agregar/agregar.module').then( m => m.AgregarPageModule),
    canActivate: [AgenteGuard]
  },
  {
    path: 'agente/mis-publicaciones',
    loadChildren: () => import('./pages/agente/mis-publicaciones/mis-publicaciones.module').then( m => m.MisPublicacionesPageModule),
    canActivate: [AgenteGuard]
  },
  {
    path: 'agente/editar-propiedad/:id',
    loadChildren: () => import('./pages/agente/editar-propiedad/editar-propiedad.module').then( m => m.EditarPropiedadPageModule),
    canActivate: [AgenteGuard]
  },
  {
    path: 'propiedades/habitacional/casa',
    loadChildren: () => import('./pages/propiedades/habitacional/casa/casa.module').then( m => m.CasaPageModule)
  },
  {
    path: 'propiedades/habitacional/departamento',
    loadChildren: () => import('./pages/propiedades/habitacional/departamento/departamento.module').then( m => m.DepartamentoPageModule)
  },
  {
    path: 'propiedades/comercial/locales',
    loadChildren: () => import('./pages/propiedades/comercial/locales/locales.module').then( m => m.LocalesPageModule)
  },
  {
    path: 'propiedades/comercial/edificios',
    loadChildren: () => import('./pages/propiedades/comercial/edificios/edificios.module').then( m => m.EdificiosPageModule)
  },
  {
    path: 'propiedades/comercial/oficinas',
    loadChildren: () => import('./pages/propiedades/comercial/oficinas/oficinas.module').then( m => m.OficinasPageModule)
  },
  {
    path: 'propiedades/comercial/bodegas',
    loadChildren: () => import('./pages/propiedades/comercial/bodegas/bodegas.module').then( m => m.BodegasPageModule)
  },
  {
    path: 'propiedades/comercial/terrenos',
    loadChildren: () => import('./pages/propiedades/comercial/terrenos/terrenos.module').then( m => m.TerrenosPageModule)
  },
  {
    path: 'propiedades/comercial/ranchos',
    loadChildren: () => import('./pages/propiedades/comercial/ranchos/ranchos.module').then( m => m.RanchosPageModule)
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./pages/favoritos/favoritos.module').then( m => m.FavoritosPageModule),
  },
  {
    path: 'propiedades/busqueda-rentas',
    loadChildren: () => import('./pages/propiedades/busqueda-rentas/busqueda-rentas.module').then( m => m.BusquedaRentasPageModule)
  },
  {
    path: 'propiedades/busqueda-mapas',
    loadChildren: () => import('./pages/propiedades/busqueda-mapas/busqueda-mapas.module').then( m => m.BusquedaMapasPageModule)
  },
  {
    path: 'contacto/agente',
    loadChildren: () => import('./pages/contacto/agente/agente.module').then( m => m.AgentePageModule)
  },
  {
    path: 'directorio/inmobiliarias',
    loadChildren: () => import('./pages/directorio/inmobiliarias/inmobiliarias.module').then( m => m.InmobiliariasPageModule)
  },
  {
    path: 'agentes',
    loadChildren: () => import('./pages/agentes/agentes.module').then( m => m.AgentesPageModule)
  },
  {
    path: 'detalle-propiedad/:id',
    loadChildren: () => import('./pages/detalle-propiedad/detalle-propiedad.module').then( m => m.DetallePropiedadPageModule)
  },
  {
    path: 'propiedades/comparar',
    loadChildren: () => import('./pages/propiedades/comparar/comparar.module').then( m => m.CompararPageModule)
  },
  {
  path: 'agente',
  component: CrmLayoutComponent,
  children: [
    { path: 'mensajes', loadComponent: () => import('./pages/mensajes/mensajes.page').then(m => m.MensajesPage) },
    { path: 'mensajes-agentes', loadComponent: () => import('./pages/mensajes-agentes/mensajes-agentes.page').then(m => m.MensajesAgentesPage) },
    { path: 'seguimiento', loadComponent: () => import('./pages/seguimiento/seguimiento.page').then(m => m.SeguimientoPage) },
    { path: 'requerimientos', loadComponent: () => import('./pages/requerimientos/requerimientos.page').then(m => m.RequerimientosPage) },
    // { path: 'directorio-propietarios', loadComponent: () => import('./pages/directorio/directorio.page').then(m => m.DirectorioPage) },
    { path: 'colaboraciones', loadComponent: () => import('./pages/colaboraciones/colaboraciones.page').then(m => m.ColaboracionesPage) },
    { path: 'editor-video', loadComponent: () => import('./pages/editor-video/editor-video.page').then(m => m.EditorVideoPage) },
    { path: 'redes-sociales', loadComponent: () => import('./pages/redes-sociales/redes-sociales.page').then(m => m.RedesSocialesPage) },
    { path: 'clientes', loadComponent: () => import('./pages/clientes/clientes.page').then(m => m.ClientesPage) },
    { path: 'directorio-clientes', loadComponent: () => import('./pages/directorio-clientes/directorio-clientes.page').then(m => m.DirectorioClientesPage) },
    { path: 'recorridos', loadComponent: () => import('./pages/recorridos/recorridos.page').then( m => m.RecorridosPage)},
    { path: 'propiedades-colaboracion', loadComponent: () => import('./pages/propiedades-colaboracion/propiedades-colaboracion.page').then( m => m.PropiedadesColaboracionPage) },
    { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage) },
    { path: 'directorio-clientes', loadComponent: () => import('./pages/directorio-clientes/directorio-clientes.page').then( m => m.DirectorioClientesPage) },
    { path: 'favoritos', loadComponent: () => import('./pages/favoritos/favoritos.page').then( m => m.FavoritosPage) },
  ]
  },
  {
  path: 'inmobiliaria',
  component: CrmLayoutInmobiliariaComponent,
  children: [
    { path: 'grafica-cierres', loadComponent: () => import('./pages-inm/grafica-cierres/grafica-cierres.page').then(m => m.GraficaCierresPage) },
    { path: 'grafica-propiedades', loadComponent: () => import('./pages-inm/grafica-propiedades/grafica-propiedades.page').then(m => m.GraficaPropiedadesPage) },
    { path: 'panel-general', loadComponent: () => import('./pages-inm/panel-general/panel-general.page').then(m => m.PanelGeneralPage) },
    { path: 'mensajes-clientes', loadComponent: () => import('./pages-inm/mensajes-clientes/mensajes-clientes.page').then(m => m.MensajesClientesPage) },
    { path: 'mensajes-asesores', loadComponent: () => import('./pages-inm/mensajes-asesores/mensajes-asesores.page').then(m => m.MensajesAsesoresPage) },
    { path: 'perfil-asesor', loadComponent: () => import('./pages-inm/perfil-asesor/perfil-asesor.page').then(m => m.PerfilAsesorPage) },
    { path: 'citas-programadas', loadComponent: () => import('./pages-inm/citas-programadas/citas-programadas.page').then(m => m.CitasProgramadasPage) },
    { path: 'seguimiento-cliente', loadComponent: () => import('./pages-inm/seguimiento-cliente/seguimiento-cliente.page').then(m => m.SeguimientoClientePage) },
    { path: 'directorio-clientes', loadComponent: () => import('./pages-inm/directorio-clientes/directorio-clientes.page').then(m => m.DirectorioClientesPage) },
    { path: 'favoritos-clientes', loadComponent: () => import('./pages-inm/favoritos-clientes/favoritos-clientes.page').then(m => m.FavoritosClientesPage) },
      {
    path: 'propiedad-seleccionada',
    loadComponent: () => import('./pages-inm/propiedad-seleccionada/propiedad-seleccionada.page').then( m => m.PropiedadSeleccionadaPage)
  },
    { path: 'listado-propiedades', loadComponent: () => import('./pages-inm/listado-propiedades/listado-propiedades.page').then(m => m.ListadoPropiedadesPage) },
    { path: 'kpis-lead', loadComponent: () => import('./pages-inm/kpis-lead/kpis-lead.page').then(m => m.KpisLeadPage) },
    { path: 'propiedades-colaboracion', loadComponent: () => import('./pages-inm/propiedades-colaboracion/propiedades-colaboracion.page').then(m => m.PropiedadesColaboracionPage) },
    { path: 'recorridos-programados', loadComponent: () => import('./pages-inm/recorridos-programados/recorridos-programados.page').then(m => m.RecorridosProgramadosPage) },
    { path: 'requerimientos', loadComponent: () => import('./pages-inm/requerimientos/requerimientos.page').then(m => m.RequerimientosPage) },
    { path: 'directorio-agentes', loadComponent: () => import('./pages-inm/directorio-agentes/directorio-agentes.page').then(m => m.DirectorioAgentesPage) },
    { path: 'colaboracion-agentes', loadComponent: () => import('./pages-inm/colaboracion-agentes/colaboracion-agentes.page').then(m => m.ColaboracionAgentesPage) },
    { path: 'all-media', loadComponent: () => import('./pages-inm/all-media/all-media.page').then(m => m.AllMediaPage) },
    { path: 'actividad-agente', loadComponent: () => import('./pages-inm/actividad-agente/actividad-agente.page').then( m => m.ActividadAgentePage) },
  ]
  },
  {
    path: 'recomendaciones',
    loadChildren: () => import('./pages/recomendaciones/recomendaciones.module').then( m => m.RecomendacionesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
