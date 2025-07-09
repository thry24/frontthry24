import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalesPageRoutingModule } from './locales-routing.module';

import { LocalesPage } from './locales.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalesPageRoutingModule,
    HeaderComponent,
    FooterComponent,
    LoadingComponent
  ],
  declarations: [LocalesPage]
})
export class LocalesPageModule {}
