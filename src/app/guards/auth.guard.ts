import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertaService } from '../services/alerta.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private alerta: AlertaService) {}

  canActivate(): boolean | UrlTree {
    const estaLoggeado = this.authService.estaAutenticado();

    if (!estaLoggeado) {
      return true; 
    }

    this.alerta.mostrar(
      'Ya tienes una sesión activa. Redirigiendo al inicio...',
      'warning'
    );

    return this.router.parseUrl('/home');
  }
}
