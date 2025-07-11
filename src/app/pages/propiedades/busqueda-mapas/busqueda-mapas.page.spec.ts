import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedaMapasPage } from './busqueda-mapas.page';

describe('BusquedaMapasPage', () => {
  let component: BusquedaMapasPage;
  let fixture: ComponentFixture<BusquedaMapasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaMapasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
