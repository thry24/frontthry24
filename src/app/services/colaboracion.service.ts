import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ColaboracionService {
  private apiUrl = `${environment.apiUrl}/colaboraciones`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.obtenerToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // 🔹 Obtener colaboraciones por agente (ya existente)
  obtenerPorAgente(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-agente/${email}`, {
      headers: this.getHeaders()
    });
  }

  // 🔹 Crear nueva colaboración
  crearColaboracion(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data, {
      headers: this.getHeaders()
    });
  }

  // 🔹 Actualizar estado de colaboración ('ganado' | 'perdido')
  actualizarEstadoColaboracion(id: string, estado: 'ganado' | 'perdido'): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}/estado`,
      { estado },
      { headers: this.getHeaders() }
    );
  }

  // 🔹 Eliminar colaboración (opcional)
  eliminarColaboracion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
