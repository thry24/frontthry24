import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelGeneralPage } from './panel-general.page';

describe('PanelGeneralPage', () => {
  let component: PanelGeneralPage;
  let fixture: ComponentFixture<PanelGeneralPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelGeneralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
