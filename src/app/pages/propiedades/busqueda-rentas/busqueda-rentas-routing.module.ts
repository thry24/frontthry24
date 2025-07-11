import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusquedaRentasPage } from './busqueda-rentas.page';

const routes: Routes = [
  {
    path: '',
    component: BusquedaRentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusquedaRentasPageRoutingModule {}
