import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsCameraComponent } from './settings-camera.component';

describe('SettingsCameraComponent', () => {
  let component: SettingsCameraComponent;
  let fixture: ComponentFixture<SettingsCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsCameraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
