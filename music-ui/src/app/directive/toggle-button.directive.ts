import { Directive, effect, ElementRef, HostListener, inject, input, output, signal, WritableSignal } from '@angular/core';

@Directive({
  selector: '[mToggleButton]',
})
export class ToggleButtonDirective {

  readonly model = input<WritableSignal<boolean>>(signal(false));
  readonly changed = output<boolean>();

  private readonly button = inject<ElementRef<HTMLButtonElement>>(ElementRef<HTMLButtonElement>);

  constructor() {
    effect(() => this.updateCheckState(this.model()()));
  }

  @HostListener('click')
  onClick() {
    const m = this.model();
    m.update(v => !v);
    this.updateCheckState(m());
    this.changed.emit(m());
  }

  private updateCheckState(check: boolean) {
    if (check) {
      this.button.nativeElement.classList.add('active');
    } else {
      this.button.nativeElement.classList.remove('active');
    }
  }
}
