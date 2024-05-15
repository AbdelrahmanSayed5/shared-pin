import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Texteditor2Component } from './texteditor2.component';

describe('Texteditor2Component', () => {
  let component: Texteditor2Component;
  let fixture: ComponentFixture<Texteditor2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Texteditor2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Texteditor2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
