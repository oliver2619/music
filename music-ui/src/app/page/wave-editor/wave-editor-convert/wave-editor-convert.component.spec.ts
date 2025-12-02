import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveEditorConvertComponent } from './wave-editor-convert.component';

describe('WaveEditorConvertComponent', () => {
  let component: WaveEditorConvertComponent;
  let fixture: ComponentFixture<WaveEditorConvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveEditorConvertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveEditorConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
