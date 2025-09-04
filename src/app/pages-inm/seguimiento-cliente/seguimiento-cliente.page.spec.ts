import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguimientoClientePage } from './seguimiento-cliente.page';

describe('SeguimientoClientePage', () => {
  let component: SeguimientoClientePage;
  let fixture: ComponentFixture<SeguimientoClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
