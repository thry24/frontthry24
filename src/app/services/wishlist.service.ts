import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private obtenerHeaders(): HttpHeaders {
    const token = this.authService.obtenerToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  agregarAFavoritos(propiedadId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/wishlist`,
      { propiedadId },
      { headers: this.obtenerHeaders() }
    );
  }

  eliminarDeFavoritos(propiedadId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/wishlist/${propiedadId}`, {
      headers: this.obtenerHeaders(),
    });
  }

  obtenerFavoritos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/wishlist`, {
      headers: this.obtenerHeaders(),
    });
  }
}
