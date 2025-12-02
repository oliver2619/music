import { DecimalPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { settingsUnitSelector } from '../selector/settings.selector';

@Pipe({
  name: 'position'
})
export class PositionPipe implements PipeTransform {

  private readonly decimalPipe = inject(DecimalPipe);
  private readonly store = inject(Store);
  private readonly unit = this.store.selectSignal(settingsUnitSelector);

  transform(value: unknown, ..._args: unknown[]): unknown {
    if (typeof value === 'number') {
      switch (this.unit()) {
        case 'beats':
          return value < 0 ? `-${this.getBeats(-value)}` : this.getBeats(value);
        case 'samples':
          return this.decimalPipe.transform(value, '0.0-0');
        case 'seconds':
          return this.decimalPipe.transform(value, '0.0-3');
      }
    } else {
      return null;
    }
  }

  private getBeats(value: number): string {
    const beats = Math.floor(value);
    const ticks = Math.round((value - beats) * 64);
    return `${beats} ${ticks}/64`;
  }
}
