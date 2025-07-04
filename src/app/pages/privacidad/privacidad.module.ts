import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacidadPageRoutingModule } from './privacidad-routing.module';

import { PrivacidadPage } from './privacidad.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacidadPageRoutingModule,
    HeaderComponent,
    FooterComponent,
  ],
  declarations: [PrivacidadPage],
})
export class PrivacidadPageModule {}
