import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[mValid]',
})
export class ValidDirective {

  readonly mValid = input.required<boolean>();
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      if (this.mValid()) {
        this.element.nativeElement.classList.remove('invalid');
      } else {
        this.element.nativeElement.classList.add('invalid');
      }
    });
  }

}
