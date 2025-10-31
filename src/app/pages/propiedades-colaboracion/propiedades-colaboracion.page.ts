import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner, // 🟢 AGREGA ESTO
} from '@ionic/angular/standalone';
import { ColaboracionService } from 'src/app/services/colaboracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline, refreshOutline } from 'ionicons/icons';

@Component({
  selector: 'app-propiedades-colaboracion',
  templateUrl: './propiedades-colaboracion.page.html',
  styleUrls: ['./propiedades-colaboracion.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonSpinner, // 🟢 Y AQUÍ TAMBIÉN
    CommonModule,
    FormsModule,
  ],
})
export class PropiedadesColaboracionPage implements OnInit {
  colaboraciones: any[] = [];
  cargando = false;
  userEmail = '';

  constructor(
    private colabSrv: ColaboracionService,
    private authSrv: AuthService
  ) {
    addIcons({ checkmarkCircleOutline, closeCircleOutline, refreshOutline });
  }

  async ngOnInit() {
    const user = await this.authSrv.obtenerUsuarioActual();
    this.userEmail = user?.correo || user?.email || '';
    this.cargarColaboraciones();
  }

  cargarColaboraciones() {
    if (!this.userEmail) return;
    this.cargando = true;

    this.colabSrv.obtenerPorAgente(this.userEmail).subscribe({
      next: (res) => {
        this.colaboraciones = res || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar colaboraciones:', err);
        this.cargando = false;
      },
    });
  }

  actualizarEstado(colaboracion: any, nuevoEstado: 'ganado' | 'perdido') {
    if (!confirm(`¿Seguro que deseas marcar como ${nuevoEstado}?`)) return;

    this.colabSrv.actualizarEstadoColaboracion(colaboracion._id, nuevoEstado).subscribe({
      next: (res) => {
        console.log('✅ Estado actualizado:', res);
        this.cargarColaboraciones();
      },
      error: (err) => {
        console.error('❌ Error al actualizar estado:', err);
      },
    });
  }
}
