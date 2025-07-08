import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RanchosPage } from './ranchos.page';

describe('RanchosPage', () => {
  let component: RanchosPage;
  let fixture: ComponentFixture<RanchosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RanchosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
