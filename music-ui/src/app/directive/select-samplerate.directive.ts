import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[mSelectSamplerate]'
})
export class SelectSamplerateDirective {

  private readonly select: ElementRef<HTMLSelectElement> = inject(ElementRef<HTMLSelectElement>);

  constructor() {
    this.addOption('11025');
    this.addOption('16000');
    this.addOption('22050');
    this.addOption('44100');
    this.addOption('48000');
    this.addOption('88200');
    this.addOption('96000');
    this.addOption('176400');
    this.addOption('192000');
    this.addOption('352800');
    this.addOption('384000');
    this.select.nativeElement.classList.add('number');
  }

  private addOption(value: string) {
    const opt = document.createElement('option');
    opt.textContent = value;
    opt.value = value;
    this.select.nativeElement.options.add(opt);
  }
}
