import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitasProgramadasPage } from './citas-programadas.page';

describe('CitasProgramadasPage', () => {
  let component: CitasProgramadasPage;
  let fixture: ComponentFixture<CitasProgramadasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CitasProgramadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
