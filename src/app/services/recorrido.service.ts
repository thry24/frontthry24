import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecorridoService {
  private apiUrl = `${environment.apiUrl}/recorridos`; // 👈 Ajusta si tu endpoint tiene prefijo distinto

  constructor(private http: HttpClient) {}

  /** 🔹 Crear un nuevo recorrido */
  crearRecorrido(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  /** 🔹 Obtener recorridos por agente */
  obtenerPorAgente(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-agente/${email}`);
  }

  /** 🔹 Actualizar recorrido */
  actualizarRecorrido(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  /** 🔹 Eliminar recorrido */
  eliminarRecorrido(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
