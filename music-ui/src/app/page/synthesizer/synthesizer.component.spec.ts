import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesizerComponent } from './synthesizer.component';

describe('SynthesizerComponent', () => {
  let component: SynthesizerComponent;
  let fixture: ComponentFixture<SynthesizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynthesizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynthesizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
