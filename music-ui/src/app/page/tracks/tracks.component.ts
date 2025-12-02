import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TrackHeaderComponent } from "./track-header/track-header.component";
import { Store } from '@ngrx/store';
import { mixSelector } from '../../selector/mix.selector';

@Component({
  selector: 'm-tracks',
  imports: [TrackHeaderComponent],
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracksComponent {

  private readonly store = inject(Store);
  private readonly mix = this.store.selectSignal(mixSelector);

  readonly tracks = computed(() => [this.mix().masterTrack]);
}
