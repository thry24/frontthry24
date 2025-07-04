import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AlertaService } from '../../services/alerta.service';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, IonicModule],
})
export class HeaderComponent implements OnInit {
  isLogged = false;
  rol: string | null = null;
  showMenu = false;
  mostrarSesion = true;

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
    private alerta: AlertaService
  ) {}

  user: any = null;

  ngOnInit() {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.mostrarSesion =
        !url.includes('/login') && !url.includes('/registro');
      this.isLoginPage = url.includes('/login') || url.includes('/registro');
    });

    this.authService.isLogged$.subscribe((estado) => {
      this.isLogged = estado;
      this.rol = this.authService.obtenerRol();
      this.user = this.authService.obtenerUsuario();
    });

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
      this.router.navigate(['/login']);
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
      this.router.navigate([ruta]);
    } else {
      this.alerta.mostrar(
        'Debes iniciar sesión para acceder a esta sección',
        'warning'
      );
      setTimeout(() => {
        this.router.navigate(['/login']);
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
}
