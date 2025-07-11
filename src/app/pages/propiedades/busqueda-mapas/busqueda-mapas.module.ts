import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedaMapasPageRoutingModule } from './busqueda-mapas-routing.module';

import { BusquedaMapasPage } from './busqueda-mapas.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedaMapasPageRoutingModule,
    HeaderComponent,
    FooterComponent
  ],
  declarations: [BusquedaMapasPage]
})
export class BusquedaMapasPageModule {}
