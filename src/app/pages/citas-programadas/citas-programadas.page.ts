import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CitasService } from 'src/app/services/citas.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-citas-programadas',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './citas-programadas.page.html',
  styleUrls: ['./citas-programadas.page.scss']
})
export class CitasProgramadasPage implements OnInit {

  citas: any[] = [];

  filtroDia: number | null = null;
  filtroMes: number | null = null;
  filtroAnio: number | null = null;

  dias = Array.from({ length: 31 }, (_, i) => i + 1);

  meses = [
    { nombre: 'Enero', value: 0 },
    { nombre: 'Febrero', value: 1 },
    { nombre: 'Marzo', value: 2 },
    { nombre: 'Abril', value: 3 },
    { nombre: 'Mayo', value: 4 },
    { nombre: 'Junio', value: 5 },
    { nombre: 'Julio', value: 6 },
    { nombre: 'Agosto', value: 7 },
    { nombre: 'Septiembre', value: 8 },
    { nombre: 'Octubre', value: 9 },
    { nombre: 'Noviembre', value: 10 },
    { nombre: 'Diciembre', value: 11 }
  ];

  anios = [2025, 2026];

  constructor(
    private citasSrv: CitasService,
    private authSrv: AuthService
  ) {}

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    const agenteEmail = this.authSrv.obtenerUsuario()?.correo;

    this.citasSrv.obtenerCitasPorAgente(agenteEmail).subscribe(res => {
      this.citas = res || [];
    });
  }

  citasFiltradas() {
    return this.citas.filter(cita => {
      const fecha = new Date(cita.fecha);
      const diaMatch = this.filtroDia === null || fecha.getDate() === this.filtroDia;
      const mesMatch = this.filtroMes === null || fecha.getMonth() === this.filtroMes;
      const anioMatch = this.filtroAnio === null || fecha.getFullYear() === this.filtroAnio;
      return diaMatch && mesMatch && anioMatch;
    });
  }

  limpiarFiltros() {
    this.filtroDia = null;
    this.filtroMes = null;
    this.filtroAnio = null;
  }
}
