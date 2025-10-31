import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CrmLayoutComponent } from 'src/app/components/crm-layout/crm-layout.component';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

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
  requerimientosOtros: any[] = [];
  usuarioActual: any;
  zonasSeleccionadas: string[] = [];

  // Inputs de UI
  ciudadTexto = '';
  zonaTexto = '';

  // Sugerencias para nuestras listas
  sugerenciasCiudad: google.maps.places.AutocompletePrediction[] = [];
  sugerenciasZona: google.maps.places.AutocompletePrediction[] = [];

  // Google services
  private googleReady = false;
  private autoSvc!: google.maps.places.AutocompleteService;
  private geocoder!: google.maps.Geocoder;

  // Tokens de sesión (mejora calidad/costo de predictions)
  private ciudadToken?: google.maps.places.AutocompleteSessionToken;
  private zonaToken?: google.maps.places.AutocompleteSessionToken;

  // Sesgo por ciudad seleccionada
  private cityBounds?: google.maps.LatLngBounds;
  private cityLocation?: google.maps.LatLngLiteral;

  // Tu modelo original con venta/renta, etc.
  nuevoRequerimiento: any = {
    tipoPropiedad: '',
    tipoOperacion: '',
    formaPago: '',
    tipoGarantia: '',         // 'aval' | 'juridico' (solo renta)
    numeroMascotas: null,     // cantidad (solo renta)
    caracteristicas: '',
    zonas: [],
    presupuesto: '',
    notaAdicional: '',
    fechaOperacion: '',
    ciudad: '',
    nombreAgente: ''
  };

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.usuarioActual = this.auth.obtenerUsuario();
    this.obtenerRequerimientos();
  }

  ngAfterViewInit() {
    const waiter = setInterval(() => {
      const g = (window as any).google;
      if (g?.maps?.places?.AutocompleteService && g?.maps?.Geocoder) {
        clearInterval(waiter);
        this.googleReady = true;
        this.autoSvc = new g.maps.places.AutocompleteService();
        this.geocoder = new g.maps.Geocoder();
        console.log('✅ Google Maps Places cargado correctamente');
      }
    }, 300);
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  obtenerRequerimientos() {
    const token = this.auth.obtenerToken(); // 👈 usa el método de tu AuthService

    this.http.get<any[]>(`${environment.apiUrl}/requerimientos`, {
      headers: { Authorization: `Bearer ${token}` } // 👈 aquí mandas el token al backend
    }).subscribe({
      next: (res) => {
        // Filtra los requerimientos por agente actual
        this.requerimientos = res.filter(r => r.agenteId === this.usuarioActual._id);
        this.requerimientosOtros = res.filter(r => r.agenteId !== this.usuarioActual._id);
      },
      error: (err) => console.error('Error al obtener requerimientos', err)
    });
  }
    mostrarModalExito = false;
    mostrarModalError = false;
    agenteSeleccionado: any = null;

    cerrarModalExito() {
      this.mostrarModalExito = false;
    }

    cerrarModalError() {
      this.mostrarModalError = false;
    }


  contactarAgente(req: any) {
    const usuario = this.auth.obtenerUsuario(); // agente logueado
    const token = this.auth.obtenerToken();

    const mensaje = {
      nombreAgente: req.nombreAgente, // receptor
      nombreCliente: usuario?.nombre || 'Agente sin nombre', // emisor
      email: usuario?.correo || usuario?.email || 'sin-correo',
      telefono: usuario?.telefono || 'sin-teléfono',
      texto: `¡Hola ${req.nombreAgente}! Tengo una propiedad con las características que estás buscando. Por favor contáctame.`,
      tipoOperacion: req.tipoOperacion,
      ubicacion: req.ciudad,
      idPropiedad: '',
      imagenPropiedad: '',
      fecha: new Date()
    };

    this.http.post(`${environment.apiUrl}/mensajes-agentes`, mensaje, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.agenteSeleccionado = req;        // 👈 guardamos el agente receptor
        this.mostrarModalExito = true;        // 👈 abrimos el modal de éxito
      },
      error: (err) => {
        console.error('Error al enviar mensaje', err);
        this.mostrarModalError = true;        // 👈 abrimos modal de error si algo falla
      }
    });
  }



  // ====== AUTOCOMPLETE CIUDAD (con lista propia) ======
  onCiudadInput(ev: Event) {
    this.sugerenciasCiudad = [];
    if (!this.googleReady) return;

    const value = (ev.target as HTMLInputElement).value || '';
    this.ciudadTexto = value;

    if (value.trim().length < 2) return;

    this.ciudadToken ||= new (window as any).google.maps.places.AutocompleteSessionToken();

    this.autoSvc.getPlacePredictions(
      {
        input: value,
        types: ['(cities)'],
        componentRestrictions: { country: 'mx' },
        sessionToken: this.ciudadToken,
      } as any,
      (preds, status) => {
        if (status !== (window as any).google.maps.places.PlacesServiceStatus.OK) {
          this.sugerenciasCiudad = [];
          return;
        }
        this.sugerenciasCiudad = preds || [];
      }
    );
  }

  seleccionarCiudad(pred: google.maps.places.AutocompletePrediction) {
    this.ciudadTexto = pred.structured_formatting?.main_text || pred.description;
    this.nuevoRequerimiento.ciudad = this.ciudadTexto;
    this.sugerenciasCiudad = [];

    // Obtenemos bounds/centro de la ciudad para sesgar las zonas
    this.geocoder.geocode({ placeId: pred.place_id }, (res, status) => {
      if (status === 'OK' && res && res[0]) {
        const r = res[0];
        if (r.geometry?.bounds) {
          this.cityBounds = r.geometry.bounds;
        } else if (r.geometry?.viewport) {
          this.cityBounds = r.geometry.viewport;
        }
        if (r.geometry?.location) {
          this.cityLocation = r.geometry.location.toJSON();
        }
        // Nueva sesión para zonas
        this.zonaToken = new (window as any).google.maps.places.AutocompleteSessionToken();
      }
    });
  }

  // ====== AUTOCOMPLETE ZONA/COLONIA (con lista propia + sesgo por ciudad) ======
  onZonaInput(ev: Event) {
    this.sugerenciasZona = [];
    if (!this.googleReady) return;

    const value = (ev.target as HTMLInputElement).value || '';
    this.zonaTexto = value;
    if (value.trim().length < 2) return;

    this.zonaToken ||= new (window as any).google.maps.places.AutocompleteSessionToken();

    const options: any = {
      input: value,
      types: ['geocode'],
      componentRestrictions: { country: 'mx' },
      sessionToken: this.zonaToken,
    };

    // Sesgo a la ciudad seleccionada (si ya la eligió)
    if (this.cityBounds) {
      // locationBias acepta bounds o latLng; bounds = LatLngBounds
      options.locationBias = this.cityBounds;
    } else if (this.cityLocation) {
      options.locationBias = this.cityLocation;
    }

    this.autoSvc.getPlacePredictions(options, (preds, status) => {
      if (status !== (window as any).google.maps.places.PlacesServiceStatus.OK) {
        this.sugerenciasZona = [];
        return;
      }
      this.sugerenciasZona = preds || [];
    });
  }

  seleccionarZona(pred: google.maps.places.AutocompletePrediction) {
    const texto = pred.structured_formatting?.main_text || pred.description;
    if (texto && !this.zonasSeleccionadas.includes(texto)) {
      this.zonasSeleccionadas.push(texto);
    }
    this.zonaTexto = '';
    this.sugerenciasZona = [];
  }

  eliminarZona(zona: string) {
    this.zonasSeleccionadas = this.zonasSeleccionadas.filter((z) => z !== zona);
  }

  agregarRequerimiento() {
    const token = this.auth.obtenerToken();
    this.nuevoRequerimiento.zonas = this.zonasSeleccionadas;

    const usuario = this.auth.obtenerUsuario();
    this.nuevoRequerimiento.nombreAgente = usuario?.nombre || 'Agente Desconocido';

    this.http.post(`${environment.apiUrl}/requerimientos`, this.nuevoRequerimiento, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.mostrarFormulario = false;
        this.resetearFormulario();
        this.obtenerRequerimientos();
      },
      error: (err) => console.error('Error al guardar requerimiento', err),
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
      ciudad: '',
      nombreAgente: 'Michelle Bocanegra',
    };
    this.ciudadTexto = '';
    this.zonaTexto = '';
    this.zonasSeleccionadas = [];
    this.sugerenciasCiudad = [];
    this.sugerenciasZona = [];
    this.cityBounds = undefined;
    this.cityLocation = undefined;
    this.ciudadToken = undefined;
    this.zonaToken = undefined;
  }

  // ====== Presupuesto helpers ======
  formatearPresupuesto(valor: number | string): string {
    if (!valor) return '';
    const num = typeof valor === 'string' ? parseFloat(valor.replace(/[^0-9.-]+/g, '')) : valor;
    if (isNaN(num)) return '';
    return num.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });
  }

  actualizarPresupuesto(event: any): void {
    const rawValue = event.detail?.value ?? '';
    const numericValue = parseFloat(String(rawValue).replace(/[^0-9.-]+/g, ''));
    this.nuevoRequerimiento.presupuesto = isNaN(numericValue) ? 0 : numericValue;
  }

  formatearAlSalir(): void {
    const inputEl = document.querySelector('ion-input[type="text"] input') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = this.formatearPresupuesto(this.nuevoRequerimiento.presupuesto);
    }
  }
}
