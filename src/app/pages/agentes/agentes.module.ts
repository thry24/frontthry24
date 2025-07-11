import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgentesPageRoutingModule } from './agentes-routing.module';

import { AgentesPage } from './agentes.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { AlertaComponent } from "src/app/components/alerta/alerta.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgentesPageRoutingModule,
    HeaderComponent,
    FooterComponent,
    AlertaComponent
],
  declarations: [AgentesPage]
})
export class AgentesPageModule {}
