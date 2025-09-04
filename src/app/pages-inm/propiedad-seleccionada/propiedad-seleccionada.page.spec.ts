import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropiedadSeleccionadaPage } from './propiedad-seleccionada.page';

describe('PropiedadSeleccionadaPage', () => {
  let component: PropiedadSeleccionadaPage;
  let fixture: ComponentFixture<PropiedadSeleccionadaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PropiedadSeleccionadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
