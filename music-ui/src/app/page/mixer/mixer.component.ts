import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MixerTrackComponent } from "./mixer-track/mixer-track.component";
import { Store } from '@ngrx/store';
import { mixSelector } from '../../selector/mix.selector';
import { MixerFilterComponent } from "./mixer-filter/mixer-filter.component";
import { TrackType } from '../../model/track-type';
import { MutableTrackState } from '../../state/mix.state';

@Component({
  selector: 'm-mixer',
  imports: [MixerTrackComponent, MixerFilterComponent],
  templateUrl: './mixer.component.html',
  styleUrl: './mixer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixerComponent {

  private readonly store = inject(Store);
  private readonly mix = this.store.selectSignal(mixSelector);
  private readonly filter = computed(() => this.mix().visibilityFilter);

  readonly tracks = computed(() => {
    const filter = this.filter();
    const nameExp = new RegExp('.*' + filter.searchString.split('').map(ch => "\\u" + ch.codePointAt(0)!.toString(16).padStart(4, "0")).join('.*') + '.*', 'gi');
    return [this.mix().masterTrack, ...this.mix().tracks].filter(t => {
      const trackTypeMatch = (t.type === TrackType.AUDIO && filter.audioTrack)
        || (t.type === TrackType.FX && filter.fxTrack)
        || (t.type === TrackType.GROUP && filter.groupTrack)
        || (t.type === TrackType.MIDI && filter.midiTrack)
        || (t.type === TrackType.MASTER && filter.globalTrack);
      const nameMatch = filter.searchString.length > 0 && (nameExp.test(t.name) || nameExp.test(t.id));
      const muteMatch = filter.mutedTrack || (t as MutableTrackState).muted !== true;
      return (trackTypeMatch && muteMatch) || nameMatch;
    });
  });
}
