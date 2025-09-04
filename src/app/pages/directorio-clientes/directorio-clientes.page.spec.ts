import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectorioClientesPage } from './directorio-clientes.page';

describe('DirectorioClientesPage', () => {
  let component: DirectorioClientesPage;
  let fixture: ComponentFixture<DirectorioClientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorioClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
