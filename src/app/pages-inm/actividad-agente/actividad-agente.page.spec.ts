import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActividadAgentePage } from './actividad-agente.page';

describe('ActividadAgentePage', () => {
  let component: ActividadAgentePage;
  let fixture: ComponentFixture<ActividadAgentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadAgentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
