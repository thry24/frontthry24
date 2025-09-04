import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private obtenerHeaders(): HttpHeaders {
    const token = this.authService.obtenerToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  enviarRecomendacion(payload: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/recommendations`,
      payload,
      { headers: this.obtenerHeaders() }
    );
  }

  obtenerRecomendaciones(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/recommendations`,
      { headers: this.obtenerHeaders() }
    );
  }

  aceptarRecomendacion(recomendacionId: string, body?: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/recommendations/${recomendacionId}/aceptar`,
      body || {},
      { headers: this.obtenerHeaders() }
    );
  }

  rechazarRecomendacion(recomendacionId: string, body?: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/recommendations/${recomendacionId}/rechazar`,
      body || {},
      { headers: this.obtenerHeaders() }
    );
  }
}
