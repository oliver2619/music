import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveEditorControlComponent } from './wave-editor-control.component';

describe('WaveEditorControlComponent', () => {
  let component: WaveEditorControlComponent;
  let fixture: ComponentFixture<WaveEditorControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveEditorControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveEditorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
