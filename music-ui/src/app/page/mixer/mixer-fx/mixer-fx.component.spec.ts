import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixerFxComponent } from './mixer-fx.component';

describe('MixerFxComponent', () => {
  let component: MixerFxComponent;
  let fixture: ComponentFixture<MixerFxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixerFxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixerFxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
