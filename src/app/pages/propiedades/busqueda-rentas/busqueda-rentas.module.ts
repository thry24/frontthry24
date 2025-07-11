import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedaRentasPageRoutingModule } from './busqueda-rentas-routing.module';

import { BusquedaRentasPage } from './busqueda-rentas.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedaRentasPageRoutingModule,
    HeaderComponent,
    FooterComponent,
  ],
  declarations: [BusquedaRentasPage]
})
export class BusquedaRentasPageModule {}
