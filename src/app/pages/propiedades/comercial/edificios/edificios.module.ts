import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EdificiosPageRoutingModule } from './edificios-routing.module';

import { EdificiosPage } from './edificios.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EdificiosPageRoutingModule,
    HeaderComponent,
    FooterComponent
  ],
  declarations: [EdificiosPage]
})
export class EdificiosPageModule {}
