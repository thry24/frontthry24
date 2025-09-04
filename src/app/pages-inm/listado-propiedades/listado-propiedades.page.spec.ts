import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoPropiedadesPage } from './listado-propiedades.page';

describe('ListadoPropiedadesPage', () => {
  let component: ListadoPropiedadesPage;
  let fixture: ComponentFixture<ListadoPropiedadesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPropiedadesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
