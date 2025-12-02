import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveEditorActionsComponent } from './wave-editor-actions.component';

describe('WaveEditorActionsComponent', () => {
  let component: WaveEditorActionsComponent;
  let fixture: ComponentFixture<WaveEditorActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveEditorActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveEditorActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
