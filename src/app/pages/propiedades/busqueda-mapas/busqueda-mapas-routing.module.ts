import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusquedaMapasPage } from './busqueda-mapas.page';

const routes: Routes = [
  {
    path: '',
    component: BusquedaMapasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusquedaMapasPageRoutingModule {}
