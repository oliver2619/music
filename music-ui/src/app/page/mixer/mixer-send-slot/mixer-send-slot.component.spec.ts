import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixerSendSlotComponent } from './mixer-send-slot.component';

describe('MixerSendSlotComponent', () => {
  let component: MixerSendSlotComponent;
  let fixture: ComponentFixture<MixerSendSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixerSendSlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixerSendSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
