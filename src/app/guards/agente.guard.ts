import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertaService } from '../services/alerta.service';

@Injectable({
  providedIn: 'root',
})
export class AgenteGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alerta: AlertaService
  ) {}

  canActivate(): boolean | UrlTree {
    const estaLoggeado = this.authService.estaAutenticado();
    const rol = this.authService.obtenerRol();

    if (estaLoggeado && rol === 'agente') {
      return true;
    }

    this.alerta.mostrar('Acceso restringido a agentes.', 'warning');
    return this.router.parseUrl('/home');
  }
}
