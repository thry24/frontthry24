import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficaPropiedadesPage } from './grafica-propiedades.page';

describe('GraficaPropiedadesPage', () => {
  let component: GraficaPropiedadesPage;
  let fixture: ComponentFixture<GraficaPropiedadesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficaPropiedadesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
