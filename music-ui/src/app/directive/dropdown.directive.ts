import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[mDropdown]'
})
export class DropdownDirective {

  readonly dropdown = input<HTMLElement | undefined>(undefined, { alias: 'mDropdown' });
  readonly button = inject(ElementRef<HTMLElement>);

  constructor() {
    this.button.nativeElement.addEventListener('click', () => {
      this.button.nativeElement.classList.toggle('active');
      this.dropdown()?.classList.toggle('visible');
      this.updatePosition();
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: Event) {
    if (ev.target !== this.button.nativeElement) {
      this.button.nativeElement.classList.remove('active');
      this.dropdown()?.classList.remove('visible');
    }
  }

  @HostListener('window:resize')
  updatePosition() {
    const dd = this.dropdown();
    if (dd != undefined) {
      const b: HTMLElement = this.button.nativeElement;
      if (b.offsetTop < window.innerHeight / 2) {
        dd.style.top = `${b.offsetTop + b.clientHeight}px`;
      } else {
        dd.style.top = `${b.offsetTop - dd.clientHeight}px`;
      }
      if (b.offsetLeft < window.innerWidth / 2) {
        dd.style.left = `${b.offsetLeft}px`;
      } else {
        dd.style.left = `${b.offsetLeft + b.clientWidth - dd.clientWidth}px`;
      }
    }
  }
}
