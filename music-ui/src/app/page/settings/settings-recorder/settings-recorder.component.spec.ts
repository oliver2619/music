import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRecorderComponent } from './settings-recorder.component';

describe('SettingsRecorderComponent', () => {
  let component: SettingsRecorderComponent;
  let fixture: ComponentFixture<SettingsRecorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsRecorderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsRecorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
