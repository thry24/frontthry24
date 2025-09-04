import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';         // ✅ Necesario para *ngIf y *ngFor
import { FormsModule } from '@angular/forms';           // ✅ Necesario para [(ngModel)]
import { IonicModule, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-directorio-clientes',
  standalone: true,                                     // ✅ necesario para standalone
  imports: [CommonModule, FormsModule, IonicModule],    // ✅ importa todo lo necesario
  templateUrl: './directorio-clientes.page.html',
  styleUrls: ['./directorio-clientes.page.scss'],
})
export class DirectorioClientesPage implements OnInit {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];

  searchTerm: string = '';
  tipoClienteFiltro: string = '';
  estadoFiltro: string = '';

  mostrarFormulario: boolean = false;
  nuevoCliente: any = {
    nombre: '',
    email: '',
    telefono: '',
    tipoCliente: '',
    tipoOperacion: ''
  };

  
  constructor(private http: HttpClient, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.http.get<any[]>('http://localhost:5000/api/clientes').subscribe({
      next: (res) => {
        this.clientes = res;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar clientes', err),
    });
  }

  aplicarFiltros() {
    this.clientesFiltrados = this.clientes.filter(cliente => {
    const coincideBusqueda =
      !this.searchTerm ||
      cliente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      cliente.telefono?.toLowerCase().includes(this.searchTerm.toLowerCase());


      const coincideTipo =
        !this.tipoClienteFiltro || cliente.tipoCliente === this.tipoClienteFiltro;

      const coincideEstado =
        !this.estadoFiltro || (cliente.status || 'activo') === this.estadoFiltro;

      return coincideBusqueda && coincideTipo && coincideEstado;
    });
  }

  onSearchChange() {
    this.aplicarFiltros();
  }

  onFiltroChange() {
    this.aplicarFiltros();
  }

  abrirFormulario() {
    this.nuevoCliente = {
      nombre: '',
      email: '',
      telefono: '',
      tipoCliente: '',
      tipoOperacion: ''
    };
    this.mostrarFormulario = true;
  }

  editarCliente(cliente: any) {
    this.nuevoCliente = { ...cliente };
    this.mostrarFormulario = true;
  }

 guardarCliente() {
  const esNuevo = !this.nuevoCliente._id;
  const token = localStorage.getItem('token'); // ← trae el token del login

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const request = esNuevo
    ? this.http.post('http://localhost:5000/api/clientes', this.nuevoCliente, { headers })
    : this.http.put(`http://localhost:5000/api/clientes/${this.nuevoCliente._id}`, this.nuevoCliente, { headers });

  request.subscribe({
    next: () => {
      this.obtenerClientes();
      this.mostrarFormulario = false;
    },
    error: (err) => console.error('Error al guardar cliente', err),
  });
}


  confirmarEliminacion(cliente: any) {
    this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Seguro que deseas eliminar a ${cliente.nombre}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => this.eliminarCliente(cliente._id),
        },
      ],
    }).then(alert => alert.present());
  }

  eliminarCliente(id: string) {
    this.http.delete(`http://localhost:5000/api/clientes/${id}`).subscribe({
      next: () => this.obtenerClientes(),
      error: (err) => console.error('Error al eliminar cliente', err),
    });
  }
}
