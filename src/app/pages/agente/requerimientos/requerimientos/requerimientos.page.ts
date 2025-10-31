import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CrmLayoutComponent } from 'src/app/components/crm-layout/crm-layout.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-requerimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, CrmLayoutComponent],
  templateUrl: './requerimientos.page.html',
  styleUrls: ['./requerimientos.page.scss'],
})
export class RequerimientosPage implements OnInit, AfterViewInit {
  mostrarFormulario = false;
  requerimientos: any[] = [];
  zonasSeleccionadas: string[] = [];

  nuevoRequerimiento: any = {
    tipoPropiedad: '',
    tipoOperacion: '',
    formaPago: '',
    tipoGarantia: '',       // Aval o Jurídico
    numeroMascotas: null,   // Cantidad de mascotas
    caracteristicas: '',
    zonas: [],
    presupuesto: '',
    notaAdicional: '',
    fechaOperacion: '',
    ciudad: 'Querétaro',
    nombreAgente: 'Michelle Bocanegra'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerRequerimientos();
  }

  ngAfterViewInit() {
    // ✅ Nuevo método recomendado: google.maps.places.PlaceAutocompleteElement
    const interval = setInterval(() => {
      const input = document.getElementById('autocomplete') as HTMLInputElement;
      const googleLib = (window as any).google?.maps?.places;

      if (input && googleLib?.PlaceAutocompleteElement) {
        clearInterval(interval);

        const autocomplete = new googleLib.PlaceAutocompleteElement({
          inputElement: input,
          componentRestrictions: { country: ['mx'] },
          types: ['(regions)'],
        });

        autocomplete.addEventListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const zona = place?.displayName || place?.formatted_address || '';

          if (zona && typeof zona === 'string' && !this.zonasSeleccionadas.includes(zona)) {
            this.zonasSeleccionadas.push(zona);
          }

          input.value = '';
        });
      }
    }, 300);
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  obtenerRequerimientos() {
    this.http.get<any[]>(`${environment.apiUrl}/requerimientos`).subscribe({
      next: (res) => (this.requerimientos = res || []),
      error: (err) => console.error('Error al obtener requerimientos:', err)
    });
  }

  agregarRequerimiento() {
    this.nuevoRequerimiento.zonas = this.zonasSeleccionadas;
    this.nuevoRequerimiento.ciudad = 'Querétaro';

    this.http.post(`${environment.apiUrl}/requerimientos`, this.nuevoRequerimiento).subscribe({
      next: () => {
        this.mostrarFormulario = false;
        this.resetearFormulario();
        this.obtenerRequerimientos();
      },
      error: (err) => console.error('Error al guardar requerimiento:', err)
    });
  }

  resetearFormulario() {
    this.nuevoRequerimiento = {
      tipoPropiedad: '',
      tipoOperacion: '',
      formaPago: '',
      tipoGarantia: '',
      numeroMascotas: null,
      caracteristicas: '',
      zonas: [],
      presupuesto: '',
      notaAdicional: '',
      fechaOperacion: '',
      ciudad: 'Querétaro',
      nombreAgente: 'Michelle Bocanegra'
    };
    this.zonasSeleccionadas = [];
  }

  mostrarPago(): boolean {
    return this.nuevoRequerimiento.tipoOperacion === 'venta';
  }

  mostrarExtrasRenta(): boolean {
    return this.nuevoRequerimiento.tipoOperacion === 'renta';
  }

  eliminarZona(zona: string) {
    this.zonasSeleccionadas = this.zonasSeleccionadas.filter((z) => z !== zona);
  }

  formatearPresupuesto(valor: number | string): string {
    if (!valor) return '';
    const num =
      typeof valor === 'string'
        ? parseFloat(valor.replace(/[^0-9.-]+/g, ''))
        : valor;
    return num.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    });
  }

  actualizarPresupuesto(event: any): void {
    const rawValue = event.detail.value;
    const numericValue = parseFloat(
      String(rawValue).replace(/[^0-9.-]+/g, '')
    );
    this.nuevoRequerimiento.presupuesto = isNaN(numericValue)
      ? 0
      : numericValue;
  }

  formatearAlSalir(): void {
    const inputEl = document.querySelector(
      'ion-input[type="text"] input'
    ) as HTMLInputElement;
    if (inputEl) {
      inputEl.value = this.formatearPresupuesto(
        this.nuevoRequerimiento.presupuesto
      );
    }
  }
}
