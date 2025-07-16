import { Component, OnInit } from '@angular/core';
import { CompararService } from 'src/app/services/comparar.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertaService } from 'src/app/services/alerta.service';

@Component({
  selector: 'app-comparar',
  templateUrl: './comparar.page.html',
  styleUrls: ['./comparar.page.scss'],
  standalone: false,
})
export class CompararPage implements OnInit {
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

  tipoSeleccionado: string = 'casa';
  camposVisibles: { tipo: string; clave: string; label: string }[] = [];
  propiedadesComparadas: { [tipo: string]: any[] } = {};

  constructor(
    private compararService: CompararService,
    private loading: LoadingService,
    private alerta: AlertaService
  ) {}

  ngOnInit() {
    this.cargarComparadas();
    this.setCamposVisibles();
  }

  cargarComparadas() {
  this.loading.mostrar();
  this.compararService.obtenerComparaciones().subscribe({
    next: (res: any) => {
      this.propiedadesComparadas = res || {};
      this.loading.ocultar();
    },
    error: (err) => {
      console.error('Error al obtener propiedades comparadas:', err);
      this.loading.ocultar();
      this.alerta.mostrar('Error al cargar propiedades para comparar.', 'error');
    },
  });
}


  obtenerPorTipoSeleccionado(): any[] {
    return this.propiedadesComparadas[this.tipoSeleccionado] || [];
  }

  cambiarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.setCamposVisibles();
  }

  esValorVacio(valor: any): boolean {
  return (
    valor === null ||
    valor === undefined ||
    valor === '' ||
    (typeof valor === 'object' && Object.keys(valor).length === 0)
  );
}


  hayPropiedades(): boolean {
    return Object.values(this.propiedadesComparadas).some(
      (arr) => Array.isArray(arr) && arr.length > 0
    );
  }

  eliminarDeComparacion(id: string) {
  this.loading.mostrar();
  this.compararService.eliminarDeComparacion(id).subscribe({
    next: () => {
      if (this.propiedadesComparadas[this.tipoSeleccionado]) {
        this.propiedadesComparadas[this.tipoSeleccionado] = this.propiedadesComparadas[
          this.tipoSeleccionado
        ].filter((p) => p._id !== id);
      }
      this.loading.ocultar();
      this.alerta.mostrar('Propiedad eliminada de comparación.', 'success');
    },
    error: (err) => {
      console.error('Error al quitar propiedad:', err);
      this.loading.ocultar();
      this.alerta.mostrar('No se pudo eliminar la propiedad de comparación.', 'error');
    },
  });
}


  setCamposVisibles() {
    const camposPorTipo: { [clave: string]: { clave: string; label: string }[] } = {
      casa: [
        { clave: 'habitaciones', label: 'Recámaras' },
        { clave: 'recamaraPB', label: 'Recámara en PB' },
        { clave: 'banosCompletos', label: 'Baños Completos' },
        { clave: 'mediosBanos', label: 'Medios Baños' },
        { clave: 'estacionamiento', label: 'Estacionamiento' },
        { clave: 'closetVestidor', label: 'Clóset/Vestidor' },
        { clave: 'superficie', label: 'Superficie' },
        { clave: 'construccion', label: 'Construcción' },
        { clave: 'pisos', label: 'Pisos' },
        { clave: 'cocina', label: 'Cocina' },
        { clave: 'barraDesayunador', label: 'Barra Desayunador' },
        { clave: 'balcon', label: 'Balcón' },
        { clave: 'salaTV', label: 'Sala de TV' },
        { clave: 'estudio', label: 'Estudio' },
        { clave: 'areaLavado', label: 'Área de Lavado' },
        { clave: 'cuartoServicio', label: 'Cuarto de Servicio' },
        { clave: 'sotano', label: 'Sótano' },
        { clave: 'jardin', label: 'Jardín' },
        { clave: 'terraza', label: 'Terraza' },
      ],
      departamento: [
        { clave: 'habitaciones', label: 'Recámaras' },
        { clave: 'recamaraPB', label: 'Recámara en PB' },
        { clave: 'banosCompletos', label: 'Baños Completos' },
        { clave: 'mediosBanos', label: 'Medios Baños' },
        { clave: 'estacionamiento', label: 'Estacionamiento' },
        { clave: 'closetVestidor', label: 'Clóset/Vestidor' },
        { clave: 'superficie', label: 'Superficie' },
        { clave: 'construccion', label: 'Construcción' },
        { clave: 'pisos', label: 'Pisos' },
        { clave: 'cocina', label: 'Cocina' },
        { clave: 'barraDesayunador', label: 'Barra Desayunador' },
        { clave: 'balcon', label: 'Balcón' },
        { clave: 'salaTV', label: 'Sala de TV' },
        { clave: 'estudio', label: 'Estudio' },
        { clave: 'areaLavado', label: 'Área de Lavado' },
        { clave: 'cuartoServicio', label: 'Cuarto de Servicio' },
        { clave: 'sotano', label: 'Sótano' },
        { clave: 'jardin', label: 'Jardín' },
        { clave: 'terraza', label: 'Terraza' },
      ],
      terreno: [
        { clave: 'm2Frente', label: 'Frente (m)' },
        { clave: 'm2Fondo', label: 'Fondo (m)' },
        { clave: 'tipo', label: 'Tipo' },
        { clave: 'costoXM2', label: 'Costo por m²' },
        { clave: 'kmz', label: 'KMZ' },
        { clave: 'agua', label: 'Agua' },
        { clave: 'luz', label: 'Luz' },
        { clave: 'drenaje', label: 'Drenaje' },
      ],
      local: [
        { clave: 'tipoCentro', label: 'Tipo de Centro' },
        { clave: 'plaza', label: 'Plaza' },
        { clave: 'pasillo', label: 'Pasillo' },
        { clave: 'planta', label: 'Planta' },
        { clave: 'm2Frente', label: 'Frente (m)' },
        { clave: 'm2Fondo', label: 'Fondo (m)' },
        { clave: 'restriccionGiro', label: 'Restricción de Giro' },
        { clave: 'giro', label: 'Giro' },
        { clave: 'seguridad', label: 'Seguridad' },
      ],
      bodega: [
        { clave: 'tipo', label: 'Tipo' },
        { clave: 'm2Terreno', label: 'Terreno (m²)' },
        { clave: 'm2Construccion', label: 'Construcción (m²)' },
        { clave: 'oficinas', label: 'Oficinas' },
        { clave: 'banos', label: 'Baños' },
        { clave: 'recepcion', label: 'Recepción' },
        { clave: 'mezzanine', label: 'Mezzanine' },
        { clave: 'comedor', label: 'Comedor' },
        { clave: 'andenCarga', label: 'Andén de Carga' },
        { clave: 'rampas', label: 'Rampas' },
        { clave: 'patioManiobras', label: 'Patio de Maniobras' },
        { clave: 'resistenciaPiso', label: 'Resistencia del Piso' },
        { clave: 'recoleccionResiduos', label: 'Recolección de Residuos' },
        { clave: 'subestacion', label: 'Subestación' },
        { clave: 'cargaElectrica', label: 'Carga Eléctrica' },
        { clave: 'kva', label: 'KVA' },
        { clave: 'crossDocking', label: 'Cross Docking' },
        { clave: 'techoLoza', label: 'Techo Loza' },
        { clave: 'techoLamina', label: 'Techo Lámina' },
        { clave: 'arcoTecho', label: 'Arco Techo' },
        { clave: 'banosEmpleados', label: 'Baños para Empleados' },
      ],
      rancho: [
        { clave: 'hectareas', label: 'Hectáreas' },
        { clave: 'uso', label: 'Uso' },
        { clave: 'pozo', label: 'Pozo' },
        { clave: 'corrales', label: 'Corrales' },
        { clave: 'casa', label: 'Casa' },
        { clave: 'casco', label: 'Casco' },
        { clave: 'establo', label: 'Establo' },
        { clave: 'invernadero', label: 'Invernadero' },
        { clave: 'bordo', label: 'Bordo' },
      ],
      oficina: [
        { clave: 'superficie', label: 'Superficie (m²)' },
        { clave: 'privados', label: 'Privados' },
        { clave: 'salaJuntas', label: 'Salas de Junta' },
        { clave: 'banosPrivados', label: 'Baños Privados' },
        { clave: 'banosCompartidos', label: 'Baños Compartidos' },
        { clave: 'comedores', label: 'Comedores' },
        { clave: 'empleados', label: 'Empleados' },
        { clave: 'corporativo', label: 'Corporativo' },
      ],
      edificio: [
        { clave: 'm2xPiso', label: 'm² por Piso' },
        { clave: 'pisosEdificio', label: 'Total de Pisos' },
        { clave: 'oficinas', label: 'Oficinas' },
        { clave: 'sistemaIncendios', label: 'Sistema Contra Incendios' },
        { clave: 'aguasPluviales', label: 'Aguas Pluviales' },
        { clave: 'aguasNegras', label: 'Aguas Negras' },
        { clave: 'gatosHidraulicos', label: 'Gatos Hidráulicos' },
        { clave: 'autosustentable', label: 'Autosustentable' },
        { clave: 'estacionamientos', label: 'Estacionamientos' },
      ],
    };

    const grupo = ['casa', 'departamento'].includes(this.tipoSeleccionado)
      ? 'casaDepto'
      : this.tipoSeleccionado;

    const campos = camposPorTipo[this.tipoSeleccionado] || [];

    this.camposVisibles = campos.map((campo) => ({
      ...campo,
      tipo: grupo,
    }));
  }
}
