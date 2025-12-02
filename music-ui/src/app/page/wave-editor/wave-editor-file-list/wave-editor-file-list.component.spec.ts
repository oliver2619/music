import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveEditorFileListComponent } from './wave-editor-file-list.component';

describe('WaveEditorFileListComponent', () => {
  let component: WaveEditorFileListComponent;
  let fixture: ComponentFixture<WaveEditorFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveEditorFileListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveEditorFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
