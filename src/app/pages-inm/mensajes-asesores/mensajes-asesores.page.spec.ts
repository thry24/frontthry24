import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensajesAsesoresPage } from './mensajes-asesores.page';

describe('MensajesAsesoresPage', () => {
  let component: MensajesAsesoresPage;
  let fixture: ComponentFixture<MensajesAsesoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajesAsesoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
