import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedaRentasPage } from './busqueda-rentas.page';

describe('BusquedaRentasPage', () => {
  let component: BusquedaRentasPage;
  let fixture: ComponentFixture<BusquedaRentasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaRentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
