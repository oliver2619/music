import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { I18nService } from '@pluto-ngtools/i18n';

@Directive({
  selector: '[mSelectSnap]',
  host: {
    '[class.active]': 'value() !== ""'
  }
})
export class SelectSnapDirective {

  readonly value = input('');
  
  private readonly select = inject(ElementRef<HTMLSelectElement>);
  private readonly i18nService = inject(I18nService);

  constructor() {
    this.addOption('', this.i18nService.get('off'));
    for(let i = 0; i < 7; ++i) {
      const exp = 1 << i;
      this.addOption(String(1 / exp), `1/${exp}`);
    }
    effect(() => {
      this.select.nativeElement.value = this.value();
    });
  }

  private addOption(value: string, text: string) {
    const opt = document.createElement('option');
    opt.textContent = text;
    opt.value = value;
    this.select.nativeElement.options.add(opt);
  }
}
