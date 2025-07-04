import { Component, Input } from '@angular/core';
import {
  ModalController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verification-modal',
  templateUrl: './verification-modal.component.html',
  styleUrls: ['./verification-modal.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class VerificationModalComponent {
  @Input() correo!: string;
  code: string = '';

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  async verificarCodigo() {
    const loading = await this.loadingCtrl.create({
      message: 'Verificando...',
    });
    await loading.present();

    this.authService.verifyCode(this.correo, this.code).subscribe({
      next: async () => {
        this.authService.register(this.correo).subscribe({
          next: async (res) => {
            const { token, user } = res;
            this.authService.guardarSesion(token, user);
            await loading.dismiss();
            const alert = await this.alertCtrl.create({
              header: 'Éxito',
              message: 'Cuenta verificada y registrada correctamente.',
              buttons: ['OK'],
            });
            await alert.present();
            this.modalCtrl.dismiss();
            this.router.navigate(['/home']);
          },
          error: async (err) => {
            await loading.dismiss();
            const alert = await this.alertCtrl.create({
              header: 'Error al registrar',
              message: err.error?.msg || 'Error al completar el registro.',
              buttons: ['OK'],
            });
            await alert.present();
          },
        });
      },
      error: async (err) => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Código incorrecto',
          message: err.error?.msg || 'El código ingresado no es válido.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }
}
