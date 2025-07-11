import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InmobiliariasPage } from './inmobiliarias.page';

describe('InmobiliariasPage', () => {
  let component: InmobiliariasPage;
  let fixture: ComponentFixture<InmobiliariasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InmobiliariasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
