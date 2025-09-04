import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoPremiumPage } from './pago-premium.page';

describe('PagoPremiumPage', () => {
  let component: PagoPremiumPage;
  let fixture: ComponentFixture<PagoPremiumPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoPremiumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
