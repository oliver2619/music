import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { effectsActions } from '../action/effects.action';

export type EffectParamTypeJson = 'float' | 'string' | 'boolean';

export interface EffectParamJson {
  readonly type: EffectParamTypeJson;
};

export interface EffectFloatParamJson extends EffectParamJson {
  readonly type: 'float';
  readonly min: number;
  readonly max: number;
  readonly neutral?: number | undefined;
  readonly step?: number | undefined;
  readonly db?: true | undefined;
  readonly delayedUpdate?: true | undefined;
}

export interface EffectStringParamJson extends EffectParamJson {
  readonly type: 'string';
  readonly choices: readonly string[];
}

export type EffectJson = Readonly<Record<string, EffectParamJson>>;

export type EffectsJson = Readonly<Record<string, EffectJson>>;

@Injectable({
  providedIn: 'root',
})
export class EffectsService {

  private readonly store = inject(Store);

  initEffects() {
    this.getEffects().then(fx => this.store.dispatch(effectsActions.set({ effects: fx })));
  }

  private getEffects(): Promise<EffectsJson> {
    return Promise.resolve({
      'Chorus': {
        'Gain': {
          type: 'float',
          min: 0,
          max: 1,
          neutral: 1,
          db: true,
        }
      },
      'Volpan': {
        'Volume': {
          type: 'float',
          min: 0,
          max: 1,
          neutral: 1,
          db: true,
        },
        'Pan': {
          type: 'float',
          min: -1,
          max: 1,
          neutral: 0,
        },
      },
    });
  }
}
