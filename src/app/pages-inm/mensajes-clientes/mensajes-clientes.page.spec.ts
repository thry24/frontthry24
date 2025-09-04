import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensajesClientesPage } from './mensajes-clientes.page';

describe('MensajesClientesPage', () => {
  let component: MensajesClientesPage;
  let fixture: ComponentFixture<MensajesClientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajesClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
