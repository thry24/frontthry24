import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPropiedadPage } from './editar-propiedad.page';

describe('EditarPropiedadPage', () => {
  let component: EditarPropiedadPage;
  let fixture: ComponentFixture<EditarPropiedadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPropiedadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
