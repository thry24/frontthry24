import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropiedadesColaboracionPage } from './propiedades-colaboracion.page';

describe('PropiedadesColaboracionPage', () => {
  let component: PropiedadesColaboracionPage;
  let fixture: ComponentFixture<PropiedadesColaboracionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PropiedadesColaboracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
