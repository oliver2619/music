import { AfterViewInit, Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[mVisible]'
})
export class VisibleDirective implements AfterViewInit {

  readonly mVisible = input.required<boolean>();
  private readonly element = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => this.update());
  }

  ngAfterViewInit() {
    this.update();
  }

  private update() {
    this.element.nativeElement.style.visibility = this.mVisible() ? 'visible' : 'hidden';
  }
}
