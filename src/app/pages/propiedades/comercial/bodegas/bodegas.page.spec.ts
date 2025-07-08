import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BodegasPage } from './bodegas.page';

describe('BodegasPage', () => {
  let component: BodegasPage;
  let fixture: ComponentFixture<BodegasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BodegasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
