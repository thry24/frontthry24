import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CompararService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private obtenerHeaders(): HttpHeaders {
    const token = this.authService.obtenerToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  agregarAComparacion(propiedadId: string, tipoPropiedad: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/comparar`,
      { propiedadId, tipoPropiedad },
      { headers: this.obtenerHeaders() }
    );
  }

  eliminarDeComparacion(propiedadId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comparar/${propiedadId}`, {
      headers: this.obtenerHeaders(),
    });
  }

  obtenerComparaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/comparar`, {
      headers: this.obtenerHeaders(),
    });
  }
}
