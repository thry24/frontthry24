import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { VerificationModalComponent } from '../../modals/verification-modal/verification-modal.component';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {
  nombre = '';
  correo = '';
  telefono = '';
  password = '';
  verPassword = false;

  rol = '';
  inmobiliaria = '';
  listaInmobiliarias: any[] = [];

  imagenSeleccionada: File | null = null;

  imagenSeleccionadaURL: string | null = null;

  slideActual = 0;
  imagenesCarrusel: string[] = [
    'assets/img/propiedades1.jpg',
    'assets/img/propiedades2.jpg',
    'assets/img/propiedades3.jpg',
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.slideActual = (this.slideActual + 1) % this.imagenesCarrusel.length;
    }, 3000);
  }

rolCambiado() {
  this.imagenSeleccionada = null;
  this.imagenSeleccionadaURL = null;

  if (this.rol === 'agente') {
    this.inmobiliaria = 'independiente';
  } else {
    this.inmobiliaria = '';
  }
}


  seleccionarImagen(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.imagenSeleccionada = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagenSeleccionadaURL = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

quitarImagen() {
  this.imagenSeleccionada = null;
  this.imagenSeleccionadaURL = null;
}

  async enviarRegistro() {
  const loading = await this.loadingCtrl.create({
    message: 'Enviando...',
  });
  await loading.present();

  const formData = new FormData();
  formData.append('nombre', this.nombre);
  formData.append('correo', this.correo);
  formData.append('password', this.password);
  formData.append('rol', this.rol);
  formData.append('telefono', this.telefono);

  if (this.rol === 'agente') {
    formData.append('inmobiliaria', this.inmobiliaria || '');
  }

  if (this.imagenSeleccionada) {
    formData.append('file', this.imagenSeleccionada);
  }

  this.authService.initRegister(formData).subscribe({
    next: async (res) => {
      await loading.dismiss();

      const modal = await this.modalCtrl.create({
      component: VerificationModalComponent,
      componentProps: {
        correo: this.correo,
      },
      cssClass: 'custom-verification-modal'
    });

    await modal.present();
    },
    error: async (err) => {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: err.error?.msg || 'Error en el registro.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    },
  });
}


  togglePassword() {
    this.verPassword = !this.verPassword;
  }
}
