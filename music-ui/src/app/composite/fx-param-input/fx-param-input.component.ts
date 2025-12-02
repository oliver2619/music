import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SpinButtonComponent } from "../../element/spin-button/spin-button.component";
import { EffectFloatParamJson, EffectParamJson, EffectStringParamJson } from '../../service/effects.service';
import { I18nPipe } from '@pluto-ngtools/i18n';
import { DecimalPipe } from '@angular/common';
import { ChangedDirective } from "../../directive/changed.directive";
import { SelectDirective } from '../../directive/select.directive';
import { DbPipe } from '../../pipe/db.pipe';
import { ActiveDirective } from "../../directive/active.directive";

@Component({
  selector: 'm-fx-param-input',
  imports: [SpinButtonComponent, I18nPipe, ChangedDirective, SelectDirective, DecimalPipe, DbPipe, ActiveDirective],
  templateUrl: './fx-param-input.component.html',
  styleUrl: './fx-param-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FxParamInputComponent {

  readonly value = input.required<string | number | boolean>();
  readonly booleanValue = computed(() => this.value() === true);
  readonly stringValue = computed(() => {
    const v = this.value();
    return typeof v === 'string' ? v : '';
  });
  readonly floatValue = computed(() => {
    const v = this.value();
    return typeof v === 'number' ? v : 0;
  });

  readonly parameter = input.required<EffectParamJson>();
  readonly changeValue = output<string | number | boolean>();

  readonly isSpinner = computed(() => this.parameter().type === 'float');
  readonly isButton = computed(() => this.parameter().type === 'boolean');
  readonly isDropdown = computed(() => this.parameter().type === 'string');
  readonly choice = computed<readonly string[]>(() => {
    const p = this.parameter();
    if (p.type === 'string') {
      return (p as EffectStringParamJson).choices;
    } else {
      return [];
    }
  });
  readonly min = computed(() => {
    const p = this.parameter();
    if (p.type === 'float') {
      return (p as EffectFloatParamJson).min;
    } else {
      return 0;
    }
  });
  readonly max = computed(() => {
    const p = this.parameter();
    if (p.type === 'float') {
      return (p as EffectFloatParamJson).max;
    } else {
      return 0;
    }
  });
  readonly neutral = computed(() => {
    const p = this.parameter();
    if (p.type === 'float') {
      return (p as EffectFloatParamJson).neutral ?? (p as EffectFloatParamJson).min;
    } else {
      return 0;
    }
  });
  readonly step = computed<number | undefined>(() => {
    const p = this.parameter();
    if (p.type === 'float') {
      return (p as EffectFloatParamJson).step;
    } else {
      return undefined;
    }
  });
  readonly db = computed(() => {
    const p = this.parameter();
    if (p.type === 'float') {
      return (p as EffectFloatParamJson).db ?? false;
    } else {
      return false;
    }
  });
  readonly delayed = computed(() => {
    const p = this.parameter();
    if (p.type === 'float') {
      return (p as EffectFloatParamJson).delayedUpdate ?? false;
    } else {
      return false;
    }
  });

  onClickButton() {
    this.changeValue.emit(this.value() !== true);
  }

  onChangeChoice(value: string) {
    this.changeValue.emit(value);
  }

  onChangedSpinner(value: number) {
    if (this.delayed()) {
      this.changeValue.emit(value);
    }
  }

  onChangingSpinner(value: number) {
    if (!this.delayed()) {
      this.changeValue.emit(value);
    }
  }
}
