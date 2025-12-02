import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

@Directive({
  selector: '[mChanged]'
})
export class ChangedDirective {

  readonly defaultValue = input('');
  readonly changed = output<string>({ alias: 'mChanged' });

  private readonly element: ElementRef<HTMLInputElement | HTMLSelectElement> = inject(ElementRef<HTMLInputElement | HTMLSelectElement>);

  constructor() {
    const el: HTMLInputElement | HTMLSelectElement = this.element.nativeElement;
    el.addEventListener('change', () => {
      if (el.value === '' && this.defaultValue() !== '') {
        el.value = this.defaultValue();
        this.changed.emit(this.defaultValue());
      } else {
        this.changed.emit(el.value);
      }
    });
  }

  @HostListener('wheel', ['$event'])
  onWheel(ev: WheelEvent) {
    if (this.element.nativeElement instanceof HTMLSelectElement) {
      ev.preventDefault();
      if (ev.deltaY !== 0) {
        if (ev.deltaY < 0 && this.element.nativeElement.selectedIndex > 0) {
          this.element.nativeElement.value = this.element.nativeElement.options.item(this.element.nativeElement.selectedIndex - 1)!.value;
          this.changed.emit(this.element.nativeElement.value);
        } else if (ev.deltaY > 0 && this.element.nativeElement.selectedIndex < this.element.nativeElement.options.length - 1) {
          this.element.nativeElement.value = this.element.nativeElement.options.item(this.element.nativeElement.selectedIndex + 1)!.value;
          this.changed.emit(this.element.nativeElement.value);
        }
      }
    }
  }

}
