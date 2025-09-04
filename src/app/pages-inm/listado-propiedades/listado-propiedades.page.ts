import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listado-propiedades',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './listado-propiedades.page.html',
  styleUrls: ['./listado-propiedades.page.scss']
})
export class ListadoPropiedadesPage {
  propiedadesOriginal = [
    {
      tipoOperacion: 'VENTA',
      estado: 'NUEVO',
      titulo: 'Departamento Nuevo',
      descripcion: 'departamento',
      habitaciones: 2,
      banos: 2,
      estacionamientos: 1,
      sqft: 1987,
      agente: 'Mike Moore',
      imagen: 'https://th.bing.com/th/id/R.5e03a3155da1829f1f022c2868ba503f?rik=wm5Uls5WJ72MTw&riu=http%3a%2f%2fmultimedia.resem.co%2fs838x629_1466614437890_-475415698.jpg&ehk=R%2fCTA8yXuldJd4FkULhNdVNmePtS2F4%2b2mT04%2fcOJG8%3d&risl=&pid=ImgRaw&r=0',
      precio: '$125,000',
      precioSqft: '$900/Sq Ft'
    },
    {
      tipoOperacion: 'VENTA',
      estado: 'OPORTUNIDAD',
      titulo: 'Departamento Venta',
      descripcion: 'departamento',
      habitaciones: 3,
      banos: 2,
      estacionamientos: 1,
      sqft: 2541,
      agente: 'Mike Moore',
      imagen: 'https://tse1.mm.bing.net/th/id/OIP.9LOR_6hILLtyRnlkPbYl7AHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      precio: '$876,000',
      precioSqft: '$3,500/Sq Ft'
    },
    {
      tipoOperacion: 'VENTA',
      estado: '',
      titulo: 'Departamento Remodelado',
      descripcion: 'departamento',
      habitaciones: 2,
      banos: 1,
      estacionamientos: 1,
      sqft: 1780,
      agente: 'Mike Moore',
      imagen: 'https://th.bing.com/th/id/R.831e518cdf380cb389ac299deb91d8c2?rik=SmUC%2bHj3mZtkUQ&riu=http%3a%2f%2fwww.invierteconmigoenflorida.com%2fwp-content%2fuploads%2f2020%2f07%2fdoral4.jpg&ehk=yZCqjxXgTTf7Fia96iKTXnQ1wtj%2bFad3ar2jdX5ffA4%3d&risl=&pid=ImgRaw&r=0',
      precio: '$485,000',
      precioSqft: '$2,500/Sq Ft'
    }
  ];

  propiedades = [...this.propiedadesOriginal];

  filtroTipo: string = '';
  filtroEstatus: string = '';
  palabraClave: string = '';

  buscar() {
    this.propiedades = this.propiedadesOriginal.filter(p => {
      const coincideTipo = this.filtroTipo ? p.descripcion.toLowerCase().includes(this.filtroTipo.toLowerCase()) : true;
      const coincideEstatus = this.filtroEstatus ? p.estado.toLowerCase().includes(this.filtroEstatus.toLowerCase()) : true;
      const coincidePalabra = this.palabraClave ? (
        p.titulo.toLowerCase().includes(this.palabraClave.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(this.palabraClave.toLowerCase()) ||
        p.agente.toLowerCase().includes(this.palabraClave.toLowerCase())
      ) : true;
      return coincideTipo && coincideEstatus && coincidePalabra;
    });
  }

  limpiar() {
    this.filtroTipo = '';
    this.filtroEstatus = '';
    this.palabraClave = '';
    this.propiedades = [...this.propiedadesOriginal];
  }
}
