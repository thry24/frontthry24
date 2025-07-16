import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompararPageRoutingModule } from './comparar-routing.module';

import { CompararPage } from './comparar.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompararPageRoutingModule,
    HeaderComponent,
    FooterComponent
  ],
  declarations: [CompararPage]
})
export class CompararPageModule {}
