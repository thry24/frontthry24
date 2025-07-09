import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CasaPageRoutingModule } from './casa-routing.module';

import { CasaPage } from './casa.page';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CasaPageRoutingModule,
    HeaderComponent,
    FooterComponent,
    LoadingComponent
  ],
  declarations: [CasaPage]
})
export class CasaPageModule {}
