import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxParamInputComponent } from './fx-param-input.component';

describe('FxParamInputComponent', () => {
  let component: FxParamInputComponent;
  let fixture: ComponentFixture<FxParamInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FxParamInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxParamInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
