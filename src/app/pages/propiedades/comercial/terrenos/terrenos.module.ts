import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TerrenosPageRoutingModule } from './terrenos-routing.module';

import { TerrenosPage } from './terrenos.page';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TerrenosPageRoutingModule,
    HeaderComponent,
    FooterComponent
  ],
  declarations: [TerrenosPage]
})
export class TerrenosPageModule {}
