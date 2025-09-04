import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectorioAgentesPage } from './directorio-agentes.page';

describe('DirectorioAgentesPage', () => {
  let component: DirectorioAgentesPage;
  let fixture: ComponentFixture<DirectorioAgentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorioAgentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
