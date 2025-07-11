import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentePage } from './agente.page';

describe('AgentePage', () => {
  let component: AgentePage;
  let fixture: ComponentFixture<AgentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
