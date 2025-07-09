import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AgenteGuard } from './guards/agente.guard';
import { InmobiliariaGuard } from './guards/inmobiliaria.guard';

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
    loadChildren: () => import('./pages/favoritos/favoritos.module').then( m => m.FavoritosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
