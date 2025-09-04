import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritosClientesPage } from './favoritos-clientes.page';

describe('FavoritosClientesPage', () => {
  let component: FavoritosClientesPage;
  let fixture: ComponentFixture<FavoritosClientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritosClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
