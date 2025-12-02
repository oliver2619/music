import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { effectsSelector } from '../../selector/effects.selector';
import { FxParamInputComponent } from '../fx-param-input/fx-param-input.component';
import { ChangedDirective } from "../../directive/changed.directive";
import { EffectParamJson } from '../../service/effects.service';
import { SelectDirective } from '../../directive/select.directive';

const MAX_PRIMARY_PARAMETERS = 3;

@Component({
  selector: 'm-fx-param-grid',
  imports: [FxParamInputComponent, ChangedDirective, SelectDirective],
  templateUrl: './fx-param-grid.component.html',
  styleUrl: './fx-param-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FxParamGridComponent {

  readonly effect = input.required<string>();
  readonly values = input.required<Readonly<Record<string, string | boolean | number>>>();

  readonly changeValues = output<Readonly<Record<string, string | boolean | number>>>();

  private readonly store = inject(Store);

  private readonly _effects = this.store.selectSignal(effectsSelector);
  private readonly _effect = computed(() => this._effects()[this.effect()]);
  private readonly allParameters = computed(() => Object.keys(this._effect()).map(name => ({
    param: this._effect()[name],
    name,
  })));

  readonly primaryParameters = computed(() => {
    const p = this.allParameters();
    return p.length > MAX_PRIMARY_PARAMETERS ? p.slice(0, MAX_PRIMARY_PARAMETERS) : p;
  });
  readonly secondaryParameters = computed(() => {
    const p = this.allParameters();
    return p.length > MAX_PRIMARY_PARAMETERS ? p.slice(MAX_PRIMARY_PARAMETERS, p.length) : [];
  });
  readonly hasSecondaryParameters = computed(() => this.secondaryParameters().length > 0);
  readonly secondaryParameter = signal<EffectParamJson | undefined>(undefined);
  readonly secondaryParameterName = signal<string | undefined>(undefined);

  constructor() {
    effect(() => {
      const pl = this.secondaryParameters();
      if (pl.length > 0) {
        this.secondaryParameter.set(pl[0].param);
        this.secondaryParameterName.set(pl[0].name);
      } else {
        this.secondaryParameter.set(undefined);
        this.secondaryParameterName.set(undefined);
      }
    });
  }

  onChangeSecondaryParameter(ev: string) {
    this.secondaryParameterName.set(ev);
    this.secondaryParameter.set(this._effect()[ev]);
  }

  onChangeValue(param: string, value: string | number | boolean) {
    const newVal = { ...this.values(), [param]: value };
    this.changeValues.emit(newVal);
  }
}
