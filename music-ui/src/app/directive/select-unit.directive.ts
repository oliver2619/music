import { Directive, effect, ElementRef, inject } from '@angular/core';
import { I18nService } from '@pluto-ngtools/i18n';
import { Unit } from '../model/unit';
import { Store } from '@ngrx/store';
import { settingsUnitSelector } from '../selector/settings.selector';
import { settingsActions } from '../action/settings.action';

@Directive({
  selector: '[mSelectUnit]'
})
export class SelectUnitDirective {

  private readonly select = inject(ElementRef<HTMLSelectElement>);
  private readonly store = inject(Store);
  private readonly i18nService = inject(I18nService);

  constructor() {
    this.addOption('beats', 'unit.beats');
    this.addOption('seconds', 'unit.seconds');
    this.addOption('samples', 'unit.samples');
    this.select.nativeElement.addEventListener('change', () => {
      this.store.dispatch(settingsActions.setUnit({ unit: this.select.nativeElement.value as Unit }))
    });
    const unit = this.store.selectSignal(settingsUnitSelector);
    effect(() => this.select.nativeElement.value = unit());
  }

  private addOption(value: Unit, textId: string) {
    const opt = document.createElement('option');
    opt.textContent = this.i18nService.get(textId);
    opt.value = value;
    this.select.nativeElement.options.add(opt);
  }
}
