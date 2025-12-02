import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixerFilterComponent } from './mixer-filter.component';

describe('MixerFilterComponent', () => {
  let component: MixerFilterComponent;
  let fixture: ComponentFixture<MixerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixerFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
