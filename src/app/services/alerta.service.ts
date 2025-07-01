import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private alertaSubject = new BehaviorSubject<{ mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  alerta$ = this.alertaSubject.asObservable();

  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning' = 'info') {
    this.alertaSubject.next({ mensaje, tipo });
    setTimeout(() => this.ocultar(), 3000);
  }

  ocultar() {
    this.alertaSubject.next(null);
  }
}
