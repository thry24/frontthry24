// src/app/services/seguimiento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Seguimiento {
  _id?: string;
  clienteEmail: string;
  clienteNombre?: string;
  agenteEmail: string;
  tipoCliente?: string;
  tipoOperacion?: 'VENTA' | 'RENTA' | '';
  fechaPrimerContacto?: string;
  fechaFinalizacion?: string;
  estatus?: string;
  estatusOtraMotivo?: string;

  // Campos para venta
  fechaEleccion?: string;
  fechaCita?: string;
  fechaRecorrido?: string;
  fechaCarta?: string;
  docsCompletos?: boolean;
  fechaAceptacion?: string;
  fechaNotaria?: string;
  fechaBorrador?: string;
  fechaFirma?: string;

  // Campos para renta
  fechaCartaOferta?: string;
  documentosCompletos?: boolean;
  fechaBorradorArr?: string;
  fechaFirmaArr?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeguimientoService {
  private apiUrl = `${environment.apiUrl}/seguimientos`; // 👈 igual que tus otros servicios

  constructor(private http: HttpClient) {}

  /**
   * Crear o devolver un seguimiento existente (por cliente y agente)
   */
  crearOObtenerSeguimiento(data: {
    clienteEmail: string;
    clienteNombre?: string;
    agenteEmail: string;
    tipoCliente?: string | null; // 👈 aquí también
    tipoOperacion?: 'VENTA' | 'RENTA' | '';
    origen?: string;
  }): Observable<Seguimiento> {
    return this.http.post<Seguimiento>(this.apiUrl, data);
  }


  /**
   * Obtener seguimiento por cliente y agente
   */
  obtenerPorClienteAgente(clienteEmail: string, agenteEmail: string): Observable<Seguimiento> {
    const params = new HttpParams()
      .set('clienteEmail', clienteEmail)
      .set('agenteEmail', agenteEmail);
    return this.http.get<Seguimiento>(this.apiUrl, { params });
  }

  /**
   * Actualizar seguimiento por ID
   */
  actualizar(id: string, cambios: Partial<Seguimiento>): Observable<Seguimiento> {
    return this.http.patch<Seguimiento>(`${this.apiUrl}/${id}`, cambios);
  }
    obtenerPorAgente(agenteEmail: string) {
    return this.http.get<Seguimiento[]>(`${this.apiUrl}/agente/${agenteEmail}`);
    }

  cerrarSeguimiento(id: string, estadoFinal: 'ganado' | 'perdido') {
  const token = localStorage.getItem('token');
  return this.http.patch(
    `${environment.apiUrl}/chat/cerrar-seguimiento/${id}`,
    { estadoFinal },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  }
  getHorasDisponibles(agenteEmail: string, fecha: string) {
  return this.http.get<any>(`${environment.apiUrl}/citas/horas`, {
    params: { agenteEmail, fecha }
  });
}

crearCita(data: any) {
  return this.http.post<any>(`${environment.apiUrl}/citas`, data);
}

}
