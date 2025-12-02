import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveEditorWaveComponent } from './wave-editor-wave.component';

describe('WaveEditorWaveComponent', () => {
  let component: WaveEditorWaveComponent;
  let fixture: ComponentFixture<WaveEditorWaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveEditorWaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveEditorWaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
