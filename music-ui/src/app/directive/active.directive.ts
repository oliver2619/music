import { AfterViewInit, Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[mActive]'
})
export class ActiveDirective implements AfterViewInit {

  readonly mActive = input.required<boolean>();
  private readonly element = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => this.update());
  }

  ngAfterViewInit() {
    this.update();
  }

  private update() {
    if (this.mActive()) {
      this.element.nativeElement.classList.add('active');
    } else {
      this.element.nativeElement.classList.remove('active');
    }
  }
}
