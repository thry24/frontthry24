import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-clientes',
  standalone: true,
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
})
export class ClientesPage {
  cliente = {
    nombre: '',
    email: '',
    telefono: '',
    tipo: '',
  };

  guardarCliente() {
    console.log('Cliente guardado:', this.cliente);
  }
}
