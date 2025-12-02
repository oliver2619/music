import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMidiComponent } from './settings-midi.component';

describe('SettingsMidiComponent', () => {
  let component: SettingsMidiComponent;
  let fixture: ComponentFixture<SettingsMidiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsMidiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsMidiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
