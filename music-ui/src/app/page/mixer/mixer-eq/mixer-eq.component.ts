import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SpinButtonComponent } from '../../../element/spin-button/spin-button.component';
import { TrackState, TrackWithEqState } from '../../../state/mix.state';
import { MAX_EQ_PER_TRACK } from '../../../model/track';
import { MixService } from '../../../service/mix.service';

const DEFAULT_VALUES: readonly number[] = (() => {
  const arr: number[] = new Array(MAX_EQ_PER_TRACK);
  for (let i = 0; i < MAX_EQ_PER_TRACK; ++i) {
    arr[i] = 0;
  }
  return arr;
})();

@Component({
  selector: 'm-mixer-eq',
  imports: [SpinButtonComponent],
  templateUrl: './mixer-eq.component.html',
  styleUrl: './mixer-eq.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixerEqComponent {

  readonly track = input.required<TrackState>();
  readonly values = computed(() => {
    const eq = (this.track() as unknown as TrackWithEqState).eq;
    if (eq == undefined) {
      return DEFAULT_VALUES;
    } else {
      return [...eq].reverse();
    }
  });
  private readonly mixService = inject(MixService);

  onChangeValue(i: number, v: number) {
    this.mixService.setTrackEq(this.track().id, MAX_EQ_PER_TRACK - i - 1, v);
  }
}
