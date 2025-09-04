import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecomendacionesPageRoutingModule } from './recomendaciones-routing.module';

import { RecomendacionesPage } from './recomendaciones.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecomendacionesPageRoutingModule,
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
  ],
  declarations: [RecomendacionesPage]
})
export class RecomendacionesPageModule {}
