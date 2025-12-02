import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxParamGridComponent } from './fx-param-grid.component';

describe('FxParamGridComponent', () => {
  let component: FxParamGridComponent;
  let fixture: ComponentFixture<FxParamGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FxParamGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxParamGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
