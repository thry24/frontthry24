import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisPublicacionesPageRoutingModule } from './mis-publicaciones-routing.module';

import { MisPublicacionesPage } from './mis-publicaciones.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisPublicacionesPageRoutingModule,
    HeaderComponent,
    FooterComponent,
  ],
  declarations: [MisPublicacionesPage],
})
export class MisPublicacionesPageModule {}
