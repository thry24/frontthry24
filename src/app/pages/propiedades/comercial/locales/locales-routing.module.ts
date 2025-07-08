import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalesPage } from './locales.page';

const routes: Routes = [
  {
    path: '',
    component: LocalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalesPageRoutingModule {}
