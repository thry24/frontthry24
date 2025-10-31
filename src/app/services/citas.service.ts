import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private api = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.obtenerToken()}`
      })
    };
  }

  getHorasDisponibles(agenteEmail: string, fecha: string): Observable<{ horas: string[] }> {
    const params = new HttpParams().set('agenteEmail', agenteEmail).set('fecha', fecha);
    return this.http.get<{ horas: string[] }>(`${this.api}/horas`, { ...this.headers(), params });
  }

  crearCita(payload: any): Observable<any> {
    return this.http.post(this.api, payload, this.headers());
  }

  obtenerCitasPorAgente(email: string): Observable<any[]> {
    const params = new HttpParams().set('agenteEmail', email);
    return this.http.get<any[]>(`${this.api}/${email}`, this.headers());
  }
}
