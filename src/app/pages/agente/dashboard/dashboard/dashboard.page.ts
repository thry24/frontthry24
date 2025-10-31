// src/app/pages/dashboard/dashboard.page.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CrmService,
  DashboardResponse,
  UpsertObjetivoPayload,
} from 'src/app/services/crm.service';

// Normaliza el import de ApexCharts (algunas builds exponen default, otras no)
const ApexChartsRaw: any = require('apexcharts');
const ApexCharts: any = ApexChartsRaw?.default ?? ApexChartsRaw;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit, OnDestroy {
  // refs para contenedores de gráficos
  @ViewChild('elComisiones', { static: false }) elComisiones!: ElementRef;
  @ViewChild('elCerradas', { static: false }) elCerradas!: ElementRef;
  @ViewChild('elTipos', { static: false }) elTipos!: ElementRef;
  @ViewChild('elIngresadas', { static: false }) elIngresadas!: ElementRef;

  // instancias de charts
  private chComisiones?: any;
  private chCerradas?: any;
  private chTipos?: any;
  private chIngresadas?: any;

  // estado
  loading = true;
  saving = false;
  error: string | null = null;

  // pestaña activa
  activeTab: 'mensual' | 'anual' = 'mensual';

  // contexto temporal
  currentYear = new Date().getUTCFullYear();
  currentMonth = new Date().getUTCMonth() + 1; // 1..12

  // leads
  leadsMesTotales = 0;
  leadsMesGanados = 0;
  leadsMesPerdidos = 0;

  // objetivos (del server)
  objetivoComisiones = 0;
  objetivoPropiedades = 0;
  objetivoLeads = 0;
  objetivoAnualComisiones = 0;

  // inputs editables
  inputComisionesMes = 0;
  inputPropsMes = 0;
  inputLeadsMes = 0;
  inputComisionesAnual = 0;

  // métricas
  objetivoMesActual = 0;
  targetMes = 0;
  mesAnterior = 0;
  propiedadesTotal = 0;
  comisionesYTD = 0;

  // datos para gráficas
  comisionesMensuales: number[] = [];
  cerradasMensuales: number[] = [];
  tipoPropiedad: { tipo: string; total: number }[] = [];
  ingresadas6mEtiquetas: string[] = [];
  ingresadas6mValores: number[] = [];

  private viewReady = false;

  constructor(private crm: CrmService) {}

  ngOnInit(): void {
    this.cargar();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (!this.loading) this.renderCharts();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  /* ------------------------------ Data loading ----------------------------- */
  private cargar() {
    this.loading = true;
    this.error = null;

    this.crm.getDashboard().subscribe({
      next: (d: DashboardResponse) => {
        // objetivos (server)
        this.objetivoComisiones = d.objetivos.mes.comisiones ?? 0;
        this.objetivoPropiedades = d.objetivos.mes.propiedades ?? 0;
        this.objetivoLeads = d.objetivos.mes.leads ?? 0;
        this.objetivoAnualComisiones = d.objetivos.anual.comisiones ?? 0;

        // setea inputs editables a lo del server
        this.inputComisionesMes = this.objetivoComisiones;
        this.inputPropsMes = this.objetivoPropiedades;
        this.inputLeadsMes = this.objetivoLeads;
        this.inputComisionesAnual = this.objetivoAnualComisiones;

        // métricas
        this.objetivoMesActual = d.metricas.objetivoMesActual ?? 0;
        this.targetMes = d.metricas.targetMes ?? 0;
        this.mesAnterior = d.metricas.mesAnterior ?? 0;
        this.propiedadesTotal = d.metricas.propiedadesTotal ?? 0;
        this.comisionesYTD = d.metricas.comisionesYTD ?? 0;

        // leads
        this.leadsMesTotales = d.metricas.leadsMes?.totales ?? 0;
        this.leadsMesGanados = d.metricas.leadsMes?.ganados ?? 0;
        this.leadsMesPerdidos = d.metricas.leadsMes?.perdidos ?? 0;

        // gráficas
        this.comisionesMensuales = d.graficas.comisionesMensuales ?? [];
        this.cerradasMensuales = d.graficas.cerradasMensuales ?? [];
        this.tipoPropiedad = d.graficas.tipoPropiedad ?? [];
        this.ingresadas6mEtiquetas = d.graficas.ingresadas6m?.etiquetas ?? [];
        this.ingresadas6mValores = d.graficas.ingresadas6m?.valores ?? [];

        this.loading = false;

        // esperar a que *ngIf pinte el DOM
        setTimeout(() => {
          if (this.viewReady) this.renderCharts();
        }, 0);
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar el dashboard';
        this.loading = false;
      },
    });
  }

  /* ------------------------------ Guardar metas ---------------------------- */
  setTab(tab: 'mensual' | 'anual') {
    this.activeTab = tab;
  }

guardarMensual() {
  this.saving = true;

  const payload = {
    year: this.currentYear,
    month: this.currentMonth,
    objetivoComisiones: Number(this.inputComisionesMes) || 0,
    objetivoPropiedades: Number(this.inputPropsMes) || 0,
    objetivoLeads: Number(this.inputLeadsMes) || 0
  };

  this.crm.upsertObjetivo(payload).subscribe({
    next: () => {
      this.saving = false;
      this.cargar(); // ✅ Recargar vista con los objetivos guardados correctamente
    },
    error: (err) => {
      console.error(err);
      this.error = 'No se pudo guardar el objetivo mensual';
      this.saving = false;
    },
  });
}


guardarAnual() {
  this.saving = true;

  const payload = {
    year: this.currentYear,
    objetivoAnualComisiones: Number(this.inputComisionesAnual) || 0
  };

  this.crm.upsertObjetivo(payload).subscribe({
    next: () => {
      this.saving = false;
      this.cargar();
    },
    error: (err) => {
      console.error(err);
      this.error = 'No se pudo guardar el objetivo anual';
      this.saving = false;
    },
  });
}

  /* --------------------------------- Charts -------------------------------- */
  private renderCharts() {
    if (
      !this.elComisiones?.nativeElement ||
      !this.elCerradas?.nativeElement ||
      !this.elTipos?.nativeElement ||
      !this.elIngresadas?.nativeElement
    ) {
      setTimeout(() => this.renderCharts(), 0);
      return;
    }

    this.destroyCharts();

    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    // Comisiones
    this.chComisiones = new ApexCharts(this.elComisiones.nativeElement, {
      series: [{ name: 'Comisiones', data: this.comisionesMensuales }],
      chart: { type: 'bar', height: 260, toolbar: { show: false } },
      xaxis: { categories: meses },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2 },
      title: { text: 'Comisiones mensuales', align: 'left' },
    });
    this.chComisiones.render();

    // Cerradas
    this.chCerradas = new ApexCharts(this.elCerradas.nativeElement, {
      series: [{ name: 'Cerradas', data: this.cerradasMensuales }],
      chart: { type: 'line', height: 260, toolbar: { show: false } },
      xaxis: { categories: meses },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2 },
      title: { text: 'Propiedades cerradas', align: 'left' },
    });
    this.chCerradas.render();

    // Tipos
    this.chTipos = new ApexCharts(this.elTipos.nativeElement, {
      series: this.tipoPropiedad.map((t) => t.total),
      chart: { type: 'donut', height: 260, toolbar: { show: false } },
      labels: this.tipoPropiedad.map((t) => t.tipo || 'N/A'),
      legend: { position: 'bottom' },
      title: { text: 'Tipo de propiedad', align: 'left' },
    });
    this.chTipos.render();

    // Ingresadas 6m
    this.chIngresadas = new ApexCharts(this.elIngresadas.nativeElement, {
      series: [{ name: 'Ingresadas', data: this.ingresadas6mValores }],
      chart: { type: 'bar', height: 260, toolbar: { show: false } },
      xaxis: { categories: this.ingresadas6mEtiquetas },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2 },
      title: { text: 'Propiedades ingresadas (6m)', align: 'left' },
    });
    this.chIngresadas.render();
  }

  private destroyCharts() {
    this.chComisiones?.destroy();
    this.chComisiones = undefined;

    this.chCerradas?.destroy();
    this.chCerradas = undefined;

    this.chTipos?.destroy();
    this.chTipos = undefined;

    this.chIngresadas?.destroy();
    this.chIngresadas = undefined;
  }
}
