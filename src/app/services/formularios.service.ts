import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {
  private apiUrl = `${environment.apiUrl}/formulario`;

  constructor(private http: HttpClient) {}

  enviarFormulario(datos: any) {
    return this.http.post(this.apiUrl, datos);
  }
}
