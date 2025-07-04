import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisPublicacionesPage } from './mis-publicaciones.page';

describe('MisPublicacionesPage', () => {
  let component: MisPublicacionesPage;
  let fixture: ComponentFixture<MisPublicacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisPublicacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
