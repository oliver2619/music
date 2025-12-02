import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixerTrackComponent } from './mixer-track.component';

describe('MixerTrackComponent', () => {
  let component: MixerTrackComponent;
  let fixture: ComponentFixture<MixerTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixerTrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixerTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
