import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrmLayoutComponent } from './crm-layout.component';

describe('CrmLayoutComponent', () => {
  let component: CrmLayoutComponent;
  let fixture: ComponentFixture<CrmLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrmLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrmLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
