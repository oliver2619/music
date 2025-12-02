import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { mixAudioTracksCanInsertSelector, mixFxTracksCanInsertSelector, mixGroupTracksCanInsertSelector, mixMidiTracksCanInsertSelector, mixVisibilitySelector } from '../../../selector/mix.selector';
import { mixActions } from '../../../action/mix.action';
import { ChangingDirective } from "../../../directive/changing.directive";
import { I18nDirective, I18nPipe } from '@pluto-ngtools/i18n';
import { ActiveDirective } from "../../../directive/active.directive";
import { MixService } from '../../../service/mix.service';
import { TrackType } from '../../../model/track-type';

@Component({
  selector: 'm-mixer-filter',
  imports: [ChangingDirective, I18nDirective, ActiveDirective, I18nPipe],
  templateUrl: './mixer-filter.component.html',
  styleUrl: './mixer-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixerFilterComponent {

  private readonly store = inject(Store);

  readonly canInsertAudioTrack = this.store.selectSignal(mixAudioTracksCanInsertSelector);
  readonly canInsertMidiTrack = this.store.selectSignal(mixMidiTracksCanInsertSelector);
  readonly canInsertFxTrack = this.store.selectSignal(mixFxTracksCanInsertSelector);
  readonly canInsertGroupTrack = this.store.selectSignal(mixGroupTracksCanInsertSelector);
  readonly visibility = this.store.selectSignal(mixVisibilitySelector);

  private readonly mixService = inject(MixService);

  onAddAudioTrack() {
    this.mixService.addTrack(TrackType.AUDIO);
  }

  onAddMidiTrack() {
    this.mixService.addTrack(TrackType.MIDI);
  }

  onAddFxTrack() {
    this.mixService.addTrack(TrackType.FX);
  }

  onAddGroupTrack() {
    this.mixService.addTrack(TrackType.GROUP);
  }

  onToggleAudioTrack() {
    this.store.dispatch(mixActions.setVisibility({ audioTrack: !this.visibility().audioTrack }));
  }

  onToggleEqSection() {
    this.store.dispatch(mixActions.setVisibility({ eqSection: !this.visibility().eqSection }));
  }

  onToggleFxSection() {
    this.store.dispatch(mixActions.setVisibility({ fxSection: !this.visibility().fxSection }));
  }

  onToggleFxTrack() {
    this.store.dispatch(mixActions.setVisibility({ fxTrack: !this.visibility().fxTrack }));
  }

  onToggleGroupTrack() {
    this.store.dispatch(mixActions.setVisibility({ groupTrack: !this.visibility().groupTrack }));
  }

  onToggleMasterTrack() {
    this.store.dispatch(mixActions.setVisibility({ globalTrack: !this.visibility().globalTrack }));
  }

  onToggleMidiTrack() {
    this.store.dispatch(mixActions.setVisibility({ midiTrack: !this.visibility().midiTrack }));
  }

  onToggleMutedTrack() {
    this.store.dispatch(mixActions.setVisibility({ mutedTrack: !this.visibility().mutedTrack }));
  }

  onToggleSendSection() {
    this.store.dispatch(mixActions.setVisibility({ sendSection: !this.visibility().sendSection }));
  }

  onChangeName(name: string) {
    this.store.dispatch(mixActions.setVisibility({ searchString: name }));
  }
}
