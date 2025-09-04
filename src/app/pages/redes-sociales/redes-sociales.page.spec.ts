import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedesSocialesPage } from './redes-sociales.page';

describe('RedesSocialesPage', () => {
  let component: RedesSocialesPage;
  let fixture: ComponentFixture<RedesSocialesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RedesSocialesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
