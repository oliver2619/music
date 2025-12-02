import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorToastStackComponent } from './error-toast-stack.component';

describe('ErrorToastStackComponent', () => {
  let component: ErrorToastStackComponent;
  let fixture: ComponentFixture<ErrorToastStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorToastStackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorToastStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
