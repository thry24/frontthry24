import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PropiedadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const token = this.authService.obtenerToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  agregarPropiedad(formData: FormData) {
    return this.http.post(`${this.apiUrl}/propiedades`, formData, {
      headers: this.getHeaders(),
    });
  }

  verificarCoordenadas(lat: number, lng: number) {
    return this.http.get<{ coincidencias: number }>(
      `${this.apiUrl}/propiedades/verificar-coordenadas?lat=${lat}&lng=${lng}`
    );
  }

  obtenerPropiedadPorId(id: string) {
    return this.http.get(`${this.apiUrl}/propiedades/${id}`, {
      headers: this.getHeaders(),
    });
  }

  obtenerPropiedadesAgente() {
    return this.http.get(`${this.apiUrl}/propiedades/agente/mis-propiedades`, {
      headers: this.getHeaders(),
    });
  }

  obtenerPropiedadesPublicadas() {
    return this.http.get(`${this.apiUrl}/propiedades`);
  }

  eliminarPropiedad(id: string) {
    return this.http.delete(`${this.apiUrl}/propiedades/${id}`, {
      headers: this.getHeaders(),
    });
  }

  publicarPropiedad(id: string) {
    return this.http.patch(
      `${this.apiUrl}/propiedades/${id}/publicar`,
      {},
      { headers: this.getHeaders() }
    );
  }

  actualizarEstadoPropiedad(id: string, estadoPropiedad: string) {
    return this.http.patch(
      `${this.apiUrl}/propiedades/${id}/estado`,
      { estadoPropiedad },
      { headers: this.getHeaders() }
    );
  }

  actualizarPropiedad(id: string, formData: FormData) {
    return this.http.put(`${this.apiUrl}/propiedades/${id}`, formData, {
      headers: this.getHeaders(),
    });
  }
}
