import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pago-premium',
  standalone: true,
  templateUrl: './pago-premium.page.html',
  styleUrls: ['./pago-premium.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
})
export class PagoPremiumPage {
  isPaying = false;

  form = {
    nombre: '',
    tarjeta: '',
    expiracion: '',
    cvv: ''
  };

  constructor(
    private navCtrl: NavController,
    private http: HttpClient
  ) {}

  simularPago() {
    this.isPaying = true;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id || user.id;


    if (!userId) {
      alert('❌ No se encontró el ID del usuario');
      this.isPaying = false;
      return;
    }

    this.http.put<{ message: string; expira: string }>(
      'http://localhost:5000/api/auth/activar-premium',
      { userId }
    ).subscribe({
      next: (res) => {
        this.isPaying = false;

        user.premium = true;
        user.premiumExpira = res.expira;
        localStorage.setItem('user', JSON.stringify(user)); // ✅ actualiza el user completo

        alert(`✅ ¡Ahora eres Premium hasta el ${new Date(res.expira).toLocaleDateString()}!`);
        this.navCtrl.navigateForward('/crm'); // o ir directo al CRM si quieres
      },
      error: () => {
        this.isPaying = false;
        alert('❌ Hubo un error al activar Premium.');
      }
    });
  }
}
