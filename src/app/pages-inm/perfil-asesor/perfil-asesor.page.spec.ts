import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilAsesorPage } from './perfil-asesor.page';

describe('PerfilAsesorPage', () => {
  let component: PerfilAsesorPage;
  let fixture: ComponentFixture<PerfilAsesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilAsesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
