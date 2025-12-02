import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UvmeterComponent } from './uvmeter.component';

describe('UvmeterComponent', () => {
  let component: UvmeterComponent;
  let fixture: ComponentFixture<UvmeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UvmeterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UvmeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
