import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensajesAgentesPage } from './mensajes-agentes.page';

describe('MensajesAgentesPage', () => {
  let component: MensajesAgentesPage;
  let fixture: ComponentFixture<MensajesAgentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajesAgentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
