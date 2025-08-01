import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { VerificationModalComponent } from '../../modals/verification-modal/verification-modal.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit, AfterViewInit {
  @ViewChild('firmaCanvas', { static: false })
  firmaCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private dibujando = false;
  firmaBase64: string = '';

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
  ngAfterViewInit(): void {
    if (this.firmaCanvas) {
      this.ctx = this.firmaCanvas.nativeElement.getContext('2d')!;
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#0a2b4a';
    }
  }

  rolCambiado() {
    this.imagenSeleccionada = null;
    this.imagenSeleccionadaURL = null;

    if (this.rol === 'agente') {
      this.inmobiliaria = 'independiente';
    } else {
      this.inmobiliaria = '';
    }
    this.firmaBase64 = '';
    if (this.ctx) {
      this.ctx.clearRect(
        0,
        0,
        this.firmaCanvas.nativeElement.width,
        this.firmaCanvas.nativeElement.height
      );
    }
  }

  iniciarDibujo(event: MouseEvent | TouchEvent) {
    this.ctx = this.firmaCanvas.nativeElement.getContext('2d')!;
    this.ctx.beginPath();
    this.dibujando = true;
    const { x, y } = this.getCoordenadas(event);
    this.ctx.moveTo(x, y);
  }
  private getCoordenadas(event: MouseEvent | TouchEvent): {
    x: number;
    y: number;
  } {
    const canvas = this.firmaCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const clientX =
      (event instanceof TouchEvent ? event.touches[0].clientX : event.clientX) -
      rect.left;
    const clientY =
      (event instanceof TouchEvent ? event.touches[0].clientY : event.clientY) -
      rect.top;
    return { x: clientX, y: clientY };
  }

  dibujar(event: MouseEvent | TouchEvent) {
    if (!this.dibujando) return;
    event.preventDefault();
    const { x, y } = this.getCoordenadas(event);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  terminarDibujo() {
    this.dibujando = false;
    this.firmaBase64 = this.firmaCanvas.nativeElement.toDataURL('image/png');
  }

  limpiarFirma() {
    this.ctx = this.firmaCanvas.nativeElement.getContext('2d')!;
    this.ctx.clearRect(
      0,
      0,
      this.firmaCanvas.nativeElement.width,
      this.firmaCanvas.nativeElement.height
    );
    this.firmaBase64 = '';
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
    if (this.rol === 'agente' && !this.firmaBase64) {
      const alerta = await this.alertCtrl.create({
        header: 'Firma requerida',
        message: 'Por favor, dibuja tu firma como asesor antes de continuar.',
        buttons: ['OK'],
      });
      await alerta.present();
      return;
    }

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
    if (this.firmaBase64) {
      formData.append('firmaBase64', this.firmaBase64);
    }

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
          cssClass: 'custom-verification-modal',
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
