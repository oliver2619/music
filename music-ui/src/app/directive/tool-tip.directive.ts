import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[mToolTip]'
})
export class ToolTipDirective {

  readonly mToolTip = input.required<string>();

  private readonly element = inject(ElementRef<HTMLElement>);

  constructor() {
    // TODO disable / enable by settings
    // TODO styling & maybe own popup element
    effect(() => {
      this.element.nativeElement.title = this.mToolTip();
    });
  }

}
