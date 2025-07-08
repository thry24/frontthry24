import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BodegasPage } from './bodegas.page';

const routes: Routes = [
  {
    path: '',
    component: BodegasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BodegasPageRoutingModule {}
