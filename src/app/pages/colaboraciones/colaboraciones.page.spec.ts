import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColaboracionesPage } from './colaboraciones.page';

describe('ColaboracionesPage', () => {
  let component: ColaboracionesPage;
  let fixture: ComponentFixture<ColaboracionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ColaboracionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
