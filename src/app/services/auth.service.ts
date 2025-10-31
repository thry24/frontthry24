import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';
  private api = environment.apiUrl;

  private isLoggedSubject = new BehaviorSubject<boolean>(this.estaAutenticado());
  isLogged$ = this.isLoggedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, { correo, password });
  }

  initRegister(data: FormData): Observable<any> {
  return this.http.post(`${this.api}/auth/initregister`, data);
}


  verifyCode(correo: string, code: string): Observable<any> {
    return this.http.post(`${this.api}/auth/verify`, { correo, code });
  }

  register(correo: string): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, { correo });
  }

  obtenerInmobiliaria(): Observable<any> {
  return this.http.get(`${this.api}/auth/inmobiliaria`);
}

  guardarSesion(token: string, user: any): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.isLoggedSubject.next(true);
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedSubject.next(false);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  obtenerUsuario(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  obtenerRol(): string | null {
    const user = this.obtenerUsuario();
    return user?.rol || null;
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }
obtenerUsuarioActual() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

guardarUsuario(usuario: any) {
  localStorage.setItem('user', JSON.stringify(usuario));
}


limpiarSesion() {
  localStorage.removeItem('user');
}

}
