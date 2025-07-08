import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RanchosPage } from './ranchos.page';

const routes: Routes = [
  {
    path: '',
    component: RanchosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RanchosPageRoutingModule {}
