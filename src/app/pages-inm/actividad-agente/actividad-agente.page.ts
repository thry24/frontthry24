import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actividad-agente',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './actividad-agente.page.html',
  styleUrls: ['./actividad-agente.page.scss']
})
export class ActividadAgentePage {
  colaboracion: boolean = true;

  // Actividades por tipo
  actividades = {
    venta: [
      'Primer contacto con el cliente',
      'Citas concertadas',
      'Elección de propiedades',
      'Programación de recorrido',
      'Segunda retroalimentación',
      'Segundo recorrido (en caso de que no haya elegido una propiedad)',
      'Elaboración de carta oferta',
      'Firma de aceptación de carta oferta',
      'Recolección de documentos',
      'Documentación enviada a notaria',
      'Envío Borrador de contrato de compraventa',
      'Firma de escrituración.'
    ],
    renta: [
      'Primer contacto con el cliente',
      'Citas concertadas',
      'Elección de propiedades',
      'Programación de recorrido',
      'Segunda retroalimentación',
      'Segundo recorrido (en caso de que no haya elegido una propiedad)',
      'Elaboración de carta oferta',
      'Firma de aceptación de carta oferta',
      'Recolección de documentos',
      'Investigación de inquilino y aval o póliza',
      'Envío de borrador de contrato',
      'Firma de contrato de arrendamiento.'
    ]
  };

  // Lista de agentes
  agentes = [
    {
      nombre: 'Laura Lopez',
      tipoOperacion: 'VENTA',
      tipoPropiedad: 'CASA',
      fechaInicio: new Date('2025-07-15'),
      foto: 'https://randomuser.me/api/portraits/women/44.jpg',
      pasoActual: 2,
      mostrarDesglose: false,
      get tipo(): 'venta' | 'renta' {
        return this.tipoOperacion.toLowerCase() as 'venta' | 'renta';
      },
      get actividadActual(): string {
        return this.pasoActual != null
          ? this.actividades[this.tipo][this.pasoActual] || 'Sin actividad'
          : 'Sin actividad';
      },
      actividades: this.actividades
    },
    {
      nombre: 'Carlos Martínez',
      tipoOperacion: 'RENTA',
      tipoPropiedad: 'DEPARTAMENTO',
      fechaInicio: new Date('2025-06-01'),
      foto: 'https://randomuser.me/api/portraits/men/32.jpg',
      pasoActual: 3,
      mostrarDesglose: false,
      get tipo(): 'venta' | 'renta' {
        return this.tipoOperacion.toLowerCase() as 'venta' | 'renta';
      },
      get actividadActual(): string {
        return this.pasoActual != null
          ? this.actividades[this.tipo][this.pasoActual] || 'Sin actividad'
          : 'Sin actividad';
      },
      actividades: this.actividades
    }
  ];

  toggleDesglose(agente: any) {
    agente.mostrarDesglose = !agente.mostrarDesglose;
  }
}
