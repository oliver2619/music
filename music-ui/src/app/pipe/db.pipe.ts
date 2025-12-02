import { inject, Pipe, PipeTransform } from '@angular/core';
import { convertAmplitudeToDb } from '../utils';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'db',
})
export class DbPipe implements PipeTransform {

  private readonly decimalPipe = inject(DecimalPipe);

  transform(value: unknown, ..._args: unknown[]): unknown {
    if (typeof value === 'number') {
      const ret = convertAmplitudeToDb(value);
      return ret === Number.NEGATIVE_INFINITY ? '-\u221E' : this.decimalPipe.transform(ret, '0.2-2') ?? '';
    } else {
      return value;
    }
  }
}
