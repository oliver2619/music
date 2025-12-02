import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SendFxState, TrackState, TrackWithSendFxState } from '../../../state/mix.state';
import { MAX_SEND_FX_PER_TRACK } from '../../../model/track';
import { MixerSendSlotComponent } from "../mixer-send-slot/mixer-send-slot.component";
import { MixService } from '../../../service/mix.service';

const DEFAULT_SLOTS: SendFxState[] = (() => {
  const ret: SendFxState[] = new Array(MAX_SEND_FX_PER_TRACK);
  for (let i = 0; i < MAX_SEND_FX_PER_TRACK; ++i) {
    ret[i] = {
      amount: 0,
      fxTrackId: '',
      postRouting: false,
    }
  }
  return ret;
})();

@Component({
  selector: 'm-mixer-send',
  imports: [MixerSendSlotComponent],
  templateUrl: './mixer-send.component.html',
  styleUrl: './mixer-send.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixerSendComponent {

  readonly track = input.required<TrackState>();
  readonly slots = computed(() => {
    const fx = (this.track() as any as TrackWithSendFxState).sendFx;
    if (fx == undefined) {
      return DEFAULT_SLOTS;
    } else {
      return [...fx].reverse();
    }
  });

  private readonly mixService = inject(MixService);

  onSetPost(i: number, post: boolean) {
    this.mixService.setTrackSendFxPost(this.track().id, MAX_SEND_FX_PER_TRACK - i - 1, post);
  }

  onSetTrackId(i: number, trackId: string) {
    this.mixService.setTrackSendFx(this.track().id, MAX_SEND_FX_PER_TRACK - i - 1, trackId);
  }

  onSetAmount(i: number, amount: number) {
    this.mixService.setTrackSendFxAmount(this.track().id, MAX_SEND_FX_PER_TRACK - i - 1, amount);
  }
}
