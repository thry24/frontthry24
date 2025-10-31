// src/app/services/crm.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// ---- Tipos opcionales (puedes simplificarlos a "any" si prefieres) ----
export type Scope = 'mensual' | 'anual';

export interface TargetsMensual {
  comisiones?: number;   // MXN
  propiedades?: number;
  leads?: number;
}
export interface TargetsAnual {
  comisiones?: number;   // MXN
}

export interface UpsertObjetivoPayload {
  year: number;
  month?: number | null;
  objetivoComisiones?: number;
  objetivoPropiedades?: number;
  objetivoLeads?: number;
  objetivoAnualComisiones?: number;
}


export interface ObjetivosResponse {
  mensual: TargetsMensual;
  anual: TargetsAnual;
  year: number;
  month: number;
}

export interface DashboardResponse {
  objetivos: {
    mes: TargetsMensual;
    anual: TargetsAnual;
  };
  metricas: {
    objetivoMesActual: number;
    targetMes: number;
    mesAnterior: number;
    propiedadesTotal: number;
    comisionesYTD: number;
    leadsMes: { totales: number; ganados: number; perdidos: number };
  };
  graficas: {
    comisionesMensuales: number[];
    cerradasMensuales: number[];
    tipoPropiedad: { tipo: string; total: number }[];
    ingresadas6m: {
      etiquetas: string[];
      valores: number[];
    };
  };
  extra: {
    conversionLeads: number;
    leadsPorPropiedad: { propiedad: string; total: number }[];
    leadsPorOrigen: { origen: string; total: number }[];
  };
}


@Injectable({ providedIn: 'root' })
export class CrmService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    const token = this.auth.obtenerToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/crm/dashboard
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.api}/crm/dashboard`, {
      headers: this.headers(),
    });
  }

  // GET /api/crm/objetivos
  getObjetivos(): Observable<ObjetivosResponse> {
    return this.http.get<ObjetivosResponse>(`${this.api}/crm/objetivos`, {
      headers: this.headers(),
    });
  }

  upsertObjetivo(payload: UpsertObjetivoPayload): Observable<any> {
    return this.http.put<any>(`${this.api}/crm/objetivos`, payload, {
      headers: this.headers(),
    });
  }

}
