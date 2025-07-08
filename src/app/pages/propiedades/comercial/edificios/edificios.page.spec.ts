import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdificiosPage } from './edificios.page';

describe('EdificiosPage', () => {
  let component: EdificiosPage;
  let fixture: ComponentFixture<EdificiosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EdificiosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
