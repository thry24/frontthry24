import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-planes',
  templateUrl: './planes.page.html',
  styleUrls: ['./planes.page.scss'],
})

export class PlanesPage implements OnInit, AfterViewInit {
  user: any = null;
  planActual: string = 'gratis';
  cargando = false;

  planes = [
    {
      nombre: 'Gratis',
      descripcion: 'Acceso básico sin funciones premium.',
      precio: '0 MXN',
      duracion: 'Ilimitado',
      tipo: 'gratis',
    },
    {
      nombre: 'Mensual',
      descripcion: 'Acceso completo al CRM durante 30 días.',
      precio: '249 MXN',
      duracion: '30 días',
      tipo: 'mensual',
    },
    {
      nombre: 'Anual',
      descripcion: 'Acceso completo al CRM durante 1 año.',
      precio: '1999 MXN',
      duracion: '365 días',
      tipo: 'anual',
    },
  ];

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private alerta: AlertaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.auth.obtenerUsuario();
    if (this.user) this.obtenerPlanActual();
  }

  obtenerPlanActual() {
    this.http
      .get<any>(`${environment.apiUrl}/suscripciones/verificar/${this.user._id}`)
      .subscribe({
        next: (res) => {
          this.planActual = res.tipoPlan || 'gratis';
        },
        error: (err) => {
          console.error('Error al obtener plan actual:', err);
          this.planActual = 'gratis';
        },
      });
  }

  ngAfterViewInit() {
    const cards = document.querySelectorAll('.plan-card');
    cards.forEach((card, i) => {
      setTimeout(() => {
        (card as HTMLElement).style.opacity = '1';
        (card as HTMLElement).style.transform = 'translateY(0)';
      }, i * 100);
    });
  }

  activarPlan(tipo: string) {
    this.cargando = true;
    const dias = tipo === 'mensual' ? 30 : tipo === 'anual' ? 365 : 0;

    this.http
      .post(`${environment.apiUrl}/suscripciones/activar/${this.user._id}`, {
        tipoPlan: tipo,
        dias,
      })
      .subscribe({
        next: () => {
          this.alerta.mostrar(`Plan ${tipo} activado correctamente.`, 'success');
          this.planActual = tipo;
          this.cargando = false;
          setTimeout(() => this.router.navigate(['/home']), 1500);
        },
        error: (err) => {
          console.error('Error al activar plan:', err);
          this.alerta.mostrar('Error al activar el plan.', 'error');
          this.cargando = false;
        },
      });
  }
}
