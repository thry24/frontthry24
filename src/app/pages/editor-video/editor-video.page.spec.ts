import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorVideoPage } from './editor-video.page';

describe('EditorVideoPage', () => {
  let component: EditorVideoPage;
  let fixture: ComponentFixture<EditorVideoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
