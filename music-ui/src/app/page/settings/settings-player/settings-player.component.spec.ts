import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPlayerComponent } from './settings-player.component';

describe('SettingsPlayerComponent', () => {
  let component: SettingsPlayerComponent;
  let fixture: ComponentFixture<SettingsPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
