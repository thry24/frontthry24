import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrmLayoutInmobiliariaComponent } from './crm-layout-inmobiliaria.component';

describe('CrmLayoutInmobiliariaComponent', () => {
  let component: CrmLayoutInmobiliariaComponent;
  let fixture: ComponentFixture<CrmLayoutInmobiliariaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmLayoutInmobiliariaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrmLayoutInmobiliariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
