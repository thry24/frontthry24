import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficaCierresPage } from './grafica-cierres.page';

describe('GraficaCierresPage', () => {
  let component: GraficaCierresPage;
  let fixture: ComponentFixture<GraficaCierresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficaCierresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
