import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallePropiedadPageRoutingModule } from './detalle-propiedad-routing.module';

import { DetallePropiedadPage } from './detalle-propiedad.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePropiedadPageRoutingModule,
    HeaderComponent,
    FooterComponent
  ],
  declarations: [DetallePropiedadPage]
})
export class DetallePropiedadPageModule {}
