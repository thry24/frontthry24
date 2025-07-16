import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertaService } from 'src/app/services/alerta.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit, OnDestroy {
  correo: string = '';
  password: string = '';
  verPassword = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private alerta: AlertaService,
    private loading: LoadingService
  ) {}

  imagenesCarrusel: string[] = [
    'assets/img/propiedades1.jpg',
    'assets/img/propiedades2.jpg',
    'assets/img/propiedades3.jpg',
  ];

  slideActual = 0;
  intervaloCarrusel: any;

  ngOnInit(): void {
    this.intervaloCarrusel = setInterval(() => {
      this.slideActual = (this.slideActual + 1) % this.imagenesCarrusel.length;
    }, 3000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervaloCarrusel);
  }

  iniciarSesion() {
    this.loading.mostrar();
    this.authService.login(this.correo, this.password).subscribe({
      next: (res) => {
        const { token, user } = res;
        this.authService.guardarSesion(token, user);
        this.correo = '';
        this.password = '';
        this.verPassword = false;
        this.loading.ocultar();
        this.alerta.mostrar('¡Bienvenido!', 'success');
        setTimeout(() => {
          window.location.href= "/home";
        }, 2000);
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        this.loading.ocultar();
        this.alerta.mostrar(
          err?.error?.message ||
            err?.error?.msg ||
            err?.message ||
            'Ocurrió un error inesperado.',
          'error'
        );
      },
    });
  }

  togglePassword() {
    this.verPassword = !this.verPassword;
  }
}
