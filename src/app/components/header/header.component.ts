import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AlertaService } from '../../services/alerta.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment'; 


@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, IonicModule, HttpClientModule],
})
export class HeaderComponent implements OnInit {
  isLogged = false;
  rol: string | null = null;
  showMenu = false;
  mostrarSesion = true;
  isCrmRoute = false;
  activeMenu: 'inicio' | 'propiedades' | 'agente' | 'inmobiliaria' | null =
    null;

  dropdownLeft = 0;
  dropdownTop = 0;
  bridgeTop = 0;
  bridgeWidth = 240;

  areaHabitacionalOpen = false;
  areaComercialOpen = false;
  isLoginPage = false;

  private hideTimer: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alerta: AlertaService,
    private http: HttpClient
  ) {}

  user: any = null;

ngOnInit() {
  this.router.events.subscribe((event) => {
    // ✅ Solo filtra eventos de navegación finalizados
    if (event instanceof NavigationEnd) {
      const url = event.urlAfterRedirects;

      // 👉 Mostrar sección de sesión solo en páginas públicas
      this.mostrarSesion =
        !url.includes('/login') &&
        !url.includes('/registro') &&
        !url.startsWith('/agente') &&
        !url.startsWith('/inmobiliaria');

      // 👉 Detectar si estás en login o registro
      this.isLoginPage = url.includes('/login') || url.includes('/registro');

      // 👉 Detectar si estás dentro del CRM (para ocultar header)
      this.isCrmRoute =
        url.startsWith('/agente') || url.startsWith('/inmobiliaria');
    }
  });

  // ✅ Estado de sesión reactivo
  this.authService.isLogged$.subscribe((estado) => {
    this.isLogged = estado;
    this.rol = this.authService.obtenerRol();
    this.user = this.authService.obtenerUsuario();
  });

  // ✅ Cargar usuario directamente (con manejo de errores)
  try {
    this.user = this.authService.obtenerUsuario();
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    this.authService.cerrarSesion();
    this.user = null;
  }
}


  logout() {
    this.authService.cerrarSesion();
    this.isLogged = false;
    this.rol = null;
    this.alerta.mostrar('Se ha cerrado sesión correctamente', 'success');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }

  toggleDropdown(
    menu: 'inicio' | 'propiedades' | 'agente' | 'inmobiliaria',
    triggerElement: HTMLElement
  ) {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouch) {
      this.showDropdown(menu, triggerElement);
    } else {
      if (this.activeMenu === menu && this.showMenu) {
        this.showMenu = false;
        this.activeMenu = null;
      } else {
        this.showDropdown(menu, triggerElement);
      }
    }
  }

  toggleSubmenu(area: 'habitacional' | 'comercial') {
    if (area === 'habitacional') {
      this.areaHabitacionalOpen = !this.areaHabitacionalOpen;
      if (this.areaHabitacionalOpen) this.areaComercialOpen = false;
    } else {
      this.areaComercialOpen = !this.areaComercialOpen;
      if (this.areaComercialOpen) this.areaHabitacionalOpen = false;
    }
  }

  showDropdown(
    menu: 'inicio' | 'propiedades' | 'agente' | 'inmobiliaria',
    triggerElement: HTMLElement
  ) {
    const rect = triggerElement.getBoundingClientRect();
    this.dropdownLeft = rect.left + window.scrollX;
    this.dropdownTop = rect.bottom + window.scrollY;
    this.bridgeTop = this.dropdownTop - 12;
    this.bridgeWidth = 240;
    this.activeMenu = menu;
    this.showMenu = true;
    clearTimeout(this.hideTimer);
  }

  startHideMenuTimer() {
    this.hideTimer = setTimeout(() => {
      this.showMenu = false;
      this.activeMenu = null;
    }, 200);
  }

  cancelHideMenu() {
    clearTimeout(this.hideTimer);
    this.showMenu = true;
  }

  navegarProtegido(ruta: string) {
    if (this.isLogged) {
      window.location.href = ruta;
    } else {
      this.alerta.mostrar(
        'Debes iniciar sesión para acceder a esta sección',
        'warning'
      );
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  handleHover(
    menu: 'inicio' | 'propiedades' | 'agente' | 'inmobiliaria',
    triggerElement: HTMLElement
  ) {
    if (!this.isTouchDevice()) {
      this.showDropdown(menu, triggerElement);
    }
  }

  handleDropdownClick(
    menu: 'inicio' | 'propiedades' | 'agente' | 'inmobiliaria',
    triggerElement: HTMLElement
  ) {
    if (this.isTouchDevice()) {
      if (this.activeMenu === menu && this.showMenu) {
        this.showMenu = false;
        this.activeMenu = null;
      } else {
        this.showDropdown(menu, triggerElement);
      }
    }
  }
  async verificarAccesoCRM() {
    const usuario = this.authService.obtenerUsuario();

    if (!usuario) {
      this.alerta.mostrar('Debes iniciar sesión primero', 'warning');
      setTimeout(() => this.router.navigate(['/login']), 1500);
      return;
    }

    try {
      // 👇 apunta al backend correcto (8080)
      const res: any = await this.http
        .get(`${environment.apiUrl}/suscripciones/verificar/${usuario._id}`)
        .toPromise();

      if (res.acceso) {
        this.router.navigate(['/agente/dashboard']);
      } else {
        this.alerta.mostrar(
          'No tienes una suscripción activa. Activa un plan para acceder al CRM.',
          'warning'
        );
        setTimeout(() => this.router.navigate(['/comprar-plan']), 2000); // 👈 redirige al page de planes
      }
    } catch (err) {
      console.error('Error al verificar plan:', err);
      this.alerta.mostrar('Error al verificar el plan. Intenta más tarde.', 'error');
    }
  }

}
