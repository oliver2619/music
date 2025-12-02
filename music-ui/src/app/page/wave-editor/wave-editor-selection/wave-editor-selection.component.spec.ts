import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveEditorSelectionComponent } from './wave-editor-selection.component';

describe('WaveEditorSelectionComponent', () => {
  let component: WaveEditorSelectionComponent;
  let fixture: ComponentFixture<WaveEditorSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveEditorSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveEditorSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
