import { Component, OnInit } from '@angular/core';
import { WishlistService } from 'src/app/services/wishlist.service';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-favoritos-clientes',
  standalone: true,
  templateUrl: './favoritos-clientes.page.html',
  styleUrls: ['./favoritos-clientes.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class FavoritosClientesPage implements OnInit {

  clientes: any[] = [];
  clienteSeleccionado = '';
  favoritos: any[] = [];

  constructor(
    private seguimientoSrv: SeguimientoService,
    private wishlistSrv: WishlistService,
    private authSrv: AuthService
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    const usuario = this.authSrv.obtenerUsuario();
    if (!usuario?.correo) {
      console.warn("⚠ No hay usuario logueado");
      return;
    }

    this.seguimientoSrv.obtenerPorAgente(usuario.correo).subscribe({
      next: (res) => {
        this.clientes = res.map(s => ({
          nombre: s.clienteNombre,
          email: s.clienteEmail
        }));
      },
      error: (err) => console.error("Error cargando clientes:", err)
    });
  }

  onSelectCliente() {
    if (!this.clienteSeleccionado) return;

    this.wishlistSrv.obtenerFavoritosCliente(this.clienteSeleccionado)
      .subscribe({
        next: (res) => this.favoritos = res || [],
        error: (err) => console.error("Error favoritos:", err)
      });
  }
}
