import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllMediaPage } from './all-media.page';

describe('AllMediaPage', () => {
  let component: AllMediaPage;
  let fixture: ComponentFixture<AllMediaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
