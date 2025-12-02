import { Directive, ElementRef, inject, input, output } from '@angular/core';

@Directive({
  selector: '[mNumberChanged]'
})
export class NumberChangedDirective {

  readonly defaultValue = input(0);
  readonly changed = output<number>({ alias: 'mNumberChanged' });

  private readonly element = inject(ElementRef<HTMLInputElement>);

  constructor() {
    const el: HTMLInputElement = this.element.nativeElement;
    el.addEventListener('change', () => {
      const v = el.valueAsNumber;
      if (isNaN(v)) {
        el.value = String(this.defaultValue());
        this.changed.emit(this.defaultValue());
      } else {
        this.changed.emit(v);
      }
    });
  }
}
