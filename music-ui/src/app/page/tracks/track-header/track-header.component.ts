import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TrackType } from '../../../model/track-type';

@Component({
  selector: 'm-track-header',
  imports: [],
  templateUrl: './track-header.component.html',
  styleUrl: './track-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackHeaderComponent {

  readonly type = input.required<TrackType>();
}
