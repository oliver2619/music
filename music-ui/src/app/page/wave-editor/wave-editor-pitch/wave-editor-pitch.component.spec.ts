import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveEditorPitchComponent } from './wave-editor-pitch.component';

describe('WaveEditorPitchComponent', () => {
  let component: WaveEditorPitchComponent;
  let fixture: ComponentFixture<WaveEditorPitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveEditorPitchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveEditorPitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
