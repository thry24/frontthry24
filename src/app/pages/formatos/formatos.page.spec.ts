import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatosPage } from './formatos.page';

describe('FormatosPage', () => {
  let component: FormatosPage;
  let fixture: ComponentFixture<FormatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
