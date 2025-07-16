import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';
import { LoadingService } from 'src/app/services/loading.service';
import { FormulariosService } from 'src/app/services/formularios.service';
import { CompararService } from 'src/app/services/comparar.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  propiedades: any[] = [];
  propiedadesFiltradas: any[] = [];
  tipoSeleccionado: string = 'casa';
  formaPago: string = '';

  formData: any = {
  tipoPropiedad: '',
  soy: '',
  nombre: '',
  apellidos: '',
  telefono: '',
  email: '',
  ciudad: '',
  municipio: '',
  caracteristicas: '',
  presupuestoMin: '',
  presupuestoMax: '',
  formaPago: '',
  medioContacto: ''
};

  tipos = [
    { clave: 'casa', label: 'Casas' },
    { clave: 'departamento', label: 'Departamentos' },
    { clave: 'terreno', label: 'Terrenos' },
    { clave: 'local', label: 'Locales' },
    { clave: 'bodega', label: 'Bodegas' },
    { clave: 'oficina', label: 'Oficinas' },
    { clave: 'edificio', label: 'Edificios' },
    { clave: 'rancho', label: 'Ranchos' },
  ];

  favoritos: string[] = [];
  comparadas: string[] = [];

  constructor(
    private propiedadService: PropiedadService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private alerta: AlertaService,
    private loading: LoadingService,
    private formulariosService: FormulariosService,
    private comparar: CompararService
  ) {}

  ngOnInit() {
    this.cargarPropiedades();
    this.cargarFavoritos();
    this.cargarComparadas();
  }
   cargarComparadas() {
    this.loading.mostrar();
    this.comparar.obtenerComparaciones().subscribe({
      next: (res) => {
        this.comparadas = res.map((p: any) => p._id);
        this.loading.ocultar();
      },
      error: (err) => {
        console.error('Error al obtener comparaciones:', err);
        this.loading.ocultar();
      },
    });
  }

  toggleComparar(event: Event, propiedadId: string, tipoPropiedad: string) {
    event.stopPropagation();

    if (!this.authService.estaAutenticado()) {
      this.alerta.mostrar('Debes iniciar sesión para comparar propiedades');

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

      return;
    }

    this.loading.mostrar();

    if (this.esComparada(propiedadId)) {
      this.comparar.eliminarDeComparacion(propiedadId).subscribe({
        next: (res: any) => {
          this.comparadas = this.comparadas.filter((id) => id !== propiedadId);
          if (res?.msg) {
            this.alerta.mostrar(res.msg);
          }
          this.loading.ocultar();
        },
        error: (err) => {
          console.error(err);
          this.alerta.mostrar(
            err.error?.msg || 'Error al eliminar de comparación.'
          );
          this.loading.ocultar();
        },
      });
    } else {
      this.comparar.agregarAComparacion(propiedadId, tipoPropiedad).subscribe({
        next: (res: any) => {
          this.comparadas.push(propiedadId);
          if (res?.msg) {
            this.alerta.mostrar(res.msg);
          }
          if (res?.advertencia) {
            this.alerta.mostrar(res.advertencia);
          }
          this.loading.ocultar();
        },
        error: (err) => {
          console.error(err);
          this.alerta.mostrar(
            err.error?.msg || 'Error al agregar a comparación.'
          );
          this.loading.ocultar();
        },
      });
    }
  }

  esComparada(propiedadId: string): boolean {
    return this.comparadas.includes(propiedadId);
  }

  cargarFavoritos() {
    this.wishlistService.obtenerFavoritos().subscribe({
      next: (res) => {
        this.favoritos = res.map((p: any) => p._id);
      },
      error: (err) => {
        console.error('Error al obtener favoritos:', err);
      },
    });
  }

  toggleFavorito(event: Event, propiedadId: string) {
    event.stopPropagation();
    if (!this.authService.estaAutenticado()) {
      this.alerta.mostrar('Debes de iniciar sesión');

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

      return;
    }

    this.loading.mostrar();

    if (this.esFavorito(propiedadId)) {
      this.wishlistService.eliminarDeFavoritos(propiedadId).subscribe({
        next: () => {
          this.favoritos = this.favoritos.filter((id) => id !== propiedadId);
          this.loading.ocultar();
        },
        error: (err) => {
          console.error(err);
          this.loading.ocultar();
        },
      });
    } else {
      this.wishlistService.agregarAFavoritos(propiedadId).subscribe({
        next: () => {
          this.favoritos.push(propiedadId);
          this.loading.ocultar();
        },
        error: (err) => {
          console.error(err), this.loading.ocultar();
        },
      });
    }
  }

  esFavorito(propiedadId: string): boolean {
    return this.favoritos.includes(propiedadId);
  }

  cambiarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.cargarPropiedades();
  }

  cargarPropiedades() {
    this.loading.mostrar();

    this.propiedadService
      .obtenerPropiedadesPublicadas({
        tipoPropiedad: this.tipoSeleccionado,
      })
      .subscribe({
        next: (res: any) => {
          this.propiedades = res.propiedades || res;
          this.propiedadesFiltradas = this.propiedades;
          this.loading.ocultar();
        },
        error: (err) => {
          console.error('Error al obtener propiedades:', err);
          this.loading.ocultar();
        },
      });
  }

  verMas() {
    const rutas: any = {
      casa: 'habitacional/casa',
      departamento: 'habitacional/departamento',
      terreno: 'comercial/terrenos',
      local: 'comercial/locales',
      bodega: 'comercial/bodegas',
      oficina: 'comercial/oficinas',
      edificio: 'comercial/edificios',
      rancho: 'comercial/ranchos',
    };

    const ruta = `/propiedades/${rutas[this.tipoSeleccionado] || ''}`;
    window.location.href = ruta;
  }

  verificarBroker() {
  if (this.formaPago === 'no-se') {
    this.alerta.mostrar('Podemos ayudarte conectándote con un broker hipotecario');
  }
}

enviarFormulario() {
   if (!this.formData.valid) {
      this.alerta.mostrar('Debes llenar todos los campos obligatorios correctamente');
      return;
    }
  if (!this.formData.email || !this.formData.telefono) return;

  this.loading.mostrar();
  this.formulariosService.enviarFormulario(this.formData).subscribe({
    next: () => {
      this.alerta.mostrar('Formulario enviado correctamente');
      this.loading.ocultar();
    },
    error: (err) => {
      console.error('Error al enviar formulario:', err);
      this.loading.ocultar();
    }
  });
}

formatearPrecio(valor: any): string {
  if (valor === null || valor === undefined || valor === '') return '';
  const numero = Number(valor);
  if (isNaN(numero)) return '';
  return '$' + numero.toLocaleString('es-MX');
}

actualizarPresupuesto(event: Event, campo: 'min' | 'max') {
  const input = event.target as HTMLInputElement;
  const valorLimpio = input.value.replace(/[^0-9]/g, '');
  const numero = parseInt(valorLimpio || '0', 10);

  if (campo === 'min') {
    this.formData.presupuestoMin = numero;
  } else {
    this.formData.presupuestoMax = numero;
  }
}


}
