import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixerSendComponent } from './mixer-send.component';

describe('MixerSendComponent', () => {
  let component: MixerSendComponent;
  let fixture: ComponentFixture<MixerSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixerSendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixerSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
