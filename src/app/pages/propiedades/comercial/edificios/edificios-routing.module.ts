import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EdificiosPage } from './edificios.page';

const routes: Routes = [
  {
    path: '',
    component: EdificiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EdificiosPageRoutingModule {}
