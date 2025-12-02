import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveEditorNewComponent } from './wave-editor-new.component';

describe('WaveEditorNewComponent', () => {
  let component: WaveEditorNewComponent;
  let fixture: ComponentFixture<WaveEditorNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveEditorNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveEditorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
