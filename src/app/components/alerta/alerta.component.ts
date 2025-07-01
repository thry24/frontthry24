import { Component, OnInit } from '@angular/core';
import { AlertaService } from '../../services/alerta.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class AlertaComponent implements OnInit {
  alerta: { mensaje: string; tipo: string } | null = null;

  constructor(public alertaService: AlertaService) {}

  ngOnInit() {
    this.alertaService.alerta$.subscribe((alerta) => (this.alerta = alerta));
  }

  getIcono(tipo: string | null): string {
    switch (tipo) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  }
}
