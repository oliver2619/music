import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixerEqComponent } from './mixer-eq.component';

describe('MixerEqComponent', () => {
  let component: MixerEqComponent;
  let fixture: ComponentFixture<MixerEqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixerEqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixerEqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
