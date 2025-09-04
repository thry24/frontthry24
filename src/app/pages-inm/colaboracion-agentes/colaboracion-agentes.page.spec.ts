import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColaboracionAgentesPage } from './colaboracion-agentes.page';

describe('ColaboracionAgentesPage', () => {
  let component: ColaboracionAgentesPage;
  let fixture: ComponentFixture<ColaboracionAgentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ColaboracionAgentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
