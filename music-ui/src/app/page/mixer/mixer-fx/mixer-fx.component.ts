import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TrackState, TrackWithFxState } from '../../../state/mix.state';
import { ActiveDirective } from "../../../directive/active.directive";
import { MAX_FX_PER_TRACK } from '../../../model/track';
import { MixService } from '../../../service/mix.service';

interface Slot {
  effect: string;
  on: boolean;
  enabled: boolean;
}

const DEFAULT_SLOTS: Slot[] = (() => {
  const ret: Slot[] = new Array(MAX_FX_PER_TRACK);
  for (let i = 0; i < MAX_FX_PER_TRACK; ++i) {
    ret[i] = {
      effect: '',
      on: false,
      enabled: false,
    }
  }
  return ret;
})();

@Component({
  selector: 'm-mixer-fx',
  imports: [ActiveDirective],
  templateUrl: './mixer-fx.component.html',
  styleUrl: './mixer-fx.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixerFxComponent {

  readonly track = input.required<TrackState>();
  readonly slots = computed(() => {
    const fx = (this.track() as unknown as TrackWithFxState).fx;
    if (fx == undefined) {
      return DEFAULT_SLOTS;
    } else {
      return fx.map(it => ({ effect: it.effect.length === 0 ? '\u2026' : it.effect, on: it.on, enabled: it.effect.length > 0 })).reverse();
    }
  });
  private readonly mixService = inject(MixService);

  onOpenEffect(i: number) {
    // console.log(MAX_FX_PER_TRACK - i - 1);
  }

  onToggleOn(i: number) {
    this.mixService.setTrackFxOn(this.track().id, MAX_FX_PER_TRACK - i - 1, !this.slots()[i].on);
  }
}
