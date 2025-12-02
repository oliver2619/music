import { AfterViewInit, Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: 'select'
})
export class SelectDirective implements AfterViewInit {

  private readonly select: ElementRef<HTMLSelectElement> = inject(ElementRef<HTMLSelectElement>);

  readonly value = input('');

  constructor() {
    effect(() => {
      this.select.nativeElement.value = this.value();
    });
  }

  ngAfterViewInit(): void {
    this.select.nativeElement.value = this.value();
  }
}
