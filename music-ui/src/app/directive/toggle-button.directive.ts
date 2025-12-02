import { Directive, effect, ElementRef, HostListener, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Directive({
  selector: '[mToggleButton]'
})
export class ToggleButtonDirective {

  readonly control = input<FormControl<boolean>>(new FormBuilder().nonNullable.control(false));
  readonly changed = output<boolean>();

  private readonly button = inject(ElementRef<HTMLButtonElement>);

  constructor() {
    effect(() => this.updateCheckState(this.control().value));
  }

  @HostListener('click')
  onClick() {
    const ctl = this.control();
    ctl.setValue(!ctl.value);
    this.updateCheckState(ctl.value);
    this.changed.emit(ctl.value);
  }

  private updateCheckState(check: boolean) {
    if (check) {
      (this.button.nativeElement as HTMLButtonElement).classList.add('active');
    } else {
      (this.button.nativeElement as HTMLButtonElement).classList.remove('active');
    }
  }
}
