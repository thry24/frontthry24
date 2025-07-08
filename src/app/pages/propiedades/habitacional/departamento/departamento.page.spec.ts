import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartamentoPage } from './departamento.page';

describe('DepartamentoPage', () => {
  let component: DepartamentoPage;
  let fixture: ComponentFixture<DepartamentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
