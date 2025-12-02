import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[mChanging]'
})
export class ChangingDirective {

  readonly changing = output<string>({ alias: 'mChanging' });

  private readonly element = inject(ElementRef<HTMLInputElement>);

  constructor() {
    const el: HTMLInputElement = this.element.nativeElement;
    el.addEventListener('input', () => {
      this.changing.emit(el.value);
    });
  }

}
