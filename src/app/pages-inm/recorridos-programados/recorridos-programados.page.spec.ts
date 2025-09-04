import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecorridosProgramadosPage } from './recorridos-programados.page';

describe('RecorridosProgramadosPage', () => {
  let component: RecorridosProgramadosPage;
  let fixture: ComponentFixture<RecorridosProgramadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecorridosProgramadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
