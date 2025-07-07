import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarPropiedadPage } from './editar-propiedad.page';

const routes: Routes = [
  {
    path: '',
    component: EditarPropiedadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarPropiedadPageRoutingModule {}
