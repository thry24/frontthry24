import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RanchosPageRoutingModule } from './ranchos-routing.module';

import { RanchosPage } from './ranchos.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RanchosPageRoutingModule,
    HeaderComponent,
    FooterComponent
  ],
  declarations: [RanchosPage]
})
export class RanchosPageModule {}
