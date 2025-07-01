import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QueEsAi24Page } from './que-es-ai24.page';

const routes: Routes = [
  {
    path: '',
    component: QueEsAi24Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueEsAi24PageRoutingModule {}
