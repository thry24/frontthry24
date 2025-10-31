import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequerimientosPage } from './requerimientos.page';

describe('RequerimientosPage', () => {
  let component: RequerimientosPage;
  let fixture: ComponentFixture<RequerimientosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequerimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
