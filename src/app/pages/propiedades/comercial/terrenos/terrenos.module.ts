import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TerrenosPageRoutingModule } from './terrenos-routing.module';

import { TerrenosPage } from './terrenos.page';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TerrenosPageRoutingModule,
    HeaderComponent,
    FooterComponent,
    LoadingComponent
  ],
  declarations: [TerrenosPage]
})
export class TerrenosPageModule {}
