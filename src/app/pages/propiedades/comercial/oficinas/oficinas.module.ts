import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OficinasPageRoutingModule } from './oficinas-routing.module';

import { OficinasPage } from './oficinas.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OficinasPageRoutingModule,
    HeaderComponent,
    FooterComponent
  ],
  declarations: [OficinasPage]
})
export class OficinasPageModule {}
