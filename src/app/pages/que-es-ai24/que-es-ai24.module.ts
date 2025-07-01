import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QueEsAi24PageRoutingModule } from './que-es-ai24-routing.module';

import { QueEsAi24Page } from './que-es-ai24.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QueEsAi24PageRoutingModule,
    HeaderComponent,
    FooterComponent
  ],
  declarations: [QueEsAi24Page]
})
export class QueEsAi24PageModule {}
