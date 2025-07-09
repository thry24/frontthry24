import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';

@Component({
  selector: 'app-terrenos',
  templateUrl: './terrenos.page.html',
  styleUrls: ['./terrenos.page.scss'],
  standalone: false,
})
export class TerrenosPage implements OnInit {
  propiedades: any[] = [];
  keyword: string = '';
  tipoOperacion: string = '';
  estado: string = '';
  estadoPropiedad: string = '';
  precioMax: string = '';
  estados: string[] = ['activa', 'oportunidad', 'remate bancario'];

  paginaActual: number = 1;
  porPagina: number = 8;

  caracteristicas: any = {
    m2Frente: '',
    m2Fondo: '',
    tipo: '',
    costoXM2: '',
  };

  mostrarCaracteristicas: boolean = false;

  costoXM2Formateado: string = '';

  constructor(private propiedadService: PropiedadService) {}

  ngOnInit() {
    this.buscarPropiedades();
  }

  get propiedadesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.propiedades.slice(inicio, inicio + this.porPagina);
  }

  formatearCostoXM2(event: any): void {
    let entrada = event.target.value;

    const valorNumerico = entrada.replace(/\D/g, '');

    this.caracteristicas.costoXM2 = valorNumerico;

    const numero = parseFloat(valorNumerico);
    this.costoXM2Formateado = isNaN(numero)
      ? ''
      : numero.toLocaleString('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
  }

  totalPaginas(): number {
    return Math.ceil(this.propiedades.length / this.porPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
    }
  }

  formatearPrecio(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    valor = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(Number(valor));

    event.target.value = valor;
  }

  buscarPropiedades() {
    const filtros: any = {
      keyword: this.keyword,
      tipoOperacion: this.tipoOperacion,
      estado: this.estado,
      estadoPropiedad: this.estadoPropiedad,
      precioMax: this.precioMax,
      tipoPropiedad: 'terreno',
    };

    const hayCaracteristicas = Object.values(this.caracteristicas).some(
      (valor) => valor !== null && valor !== '' && valor !== false
    );

    if (hayCaracteristicas) {
      filtros.caracteristicas = JSON.stringify({
        terreno: this.caracteristicas,
      });
    }

    console.log(filtros);

    this.propiedadService.obtenerPropiedadesPublicadas(filtros).subscribe({
      next: (res: any) => {
        this.propiedades = res.propiedades || res;
        this.paginaActual = 1;
      },
      error: (err) => {
        console.error('Error al filtrar propiedades:', err);
      },
    });
  }

  mensajeWhatsApp(propiedad: any): string {
    return encodeURIComponent(
      `Hola, estoy interesado en la propiedad con clave ${propiedad.clave}, ubicada en ${propiedad.direccion?.municipio}, ${propiedad.direccion?.estado}. ¿Podrías brindarme más información?`
    );
  }

  asuntoEmail(propiedad: any): string {
    return encodeURIComponent(`Interés en propiedad clave ${propiedad.clave}`);
  }

  cuerpoEmail(propiedad: any): string {
    return encodeURIComponent(
      `Hola,\n\nEstoy interesado en la propiedad con clave ${propiedad.clave}, ubicada en ${propiedad.direccion?.municipio}, ${propiedad.direccion?.estado}.\n\n¿Podrías brindarme más detalles?\n\nGracias.`
    );
  }
}
