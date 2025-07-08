import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DepartamentoPageRoutingModule } from './departamento-routing.module';

import { DepartamentoPage } from './departamento.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DepartamentoPageRoutingModule,
    HeaderComponent,
    FooterComponent
  ],
  declarations: [DepartamentoPage]
})
export class DepartamentoPageModule {}
