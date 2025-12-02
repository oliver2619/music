import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveEditorFxComponent } from './wave-editor-fx.component';

describe('WaveEditorFxComponent', () => {
  let component: WaveEditorFxComponent;
  let fixture: ComponentFixture<WaveEditorFxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveEditorFxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveEditorFxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
