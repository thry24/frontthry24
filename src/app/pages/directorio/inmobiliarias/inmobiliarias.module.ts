import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InmobiliariasPageRoutingModule } from './inmobiliarias-routing.module';

import { InmobiliariasPage } from './inmobiliarias.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InmobiliariasPageRoutingModule,
    HeaderComponent,
    FooterComponent
  ],
  declarations: [InmobiliariasPage]
})
export class InmobiliariasPageModule {}
