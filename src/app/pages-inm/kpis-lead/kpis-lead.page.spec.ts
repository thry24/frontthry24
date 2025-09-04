import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpisLeadPage } from './kpis-lead.page';

describe('KpisLeadPage', () => {
  let component: KpisLeadPage;
  let fixture: ComponentFixture<KpisLeadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KpisLeadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
