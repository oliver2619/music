import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { SliderComponent } from "../../../element/slider/slider.component";
import { NamedTrackState, MutableTrackState, TrackState, VolpanTrackState, TrackWithSendFxState, RoutedTrackState, TrackWithFxState, TrackWithEqState } from '../../../state/mix.state';
import { VisibleDirective } from '../../../directive/visible.directive';
import { Store } from '@ngrx/store';
import { mixGroupTracksSelector, mixSoloActiveSelector, mixVisibilitySelector } from '../../../selector/mix.selector';
import { MASTER_TRACK_ID } from '../../../model/track';
import { ActiveDirective } from "../../../directive/active.directive";
import { MixerEqComponent } from "../mixer-eq/mixer-eq.component";
import { SelectDirective } from '../../../directive/select.directive';
import { ChangedDirective } from '../../../directive/changed.directive';
import { MixerFxComponent } from "../mixer-fx/mixer-fx.component";
import { MixerSendComponent } from "../mixer-send/mixer-send.component";
import { TrackType } from '../../../model/track-type';
import { UvmeterComponent } from "../../../element/uvmeter/uvmeter.component";
import { MixService } from '../../../service/mix.service';

@Component({
  selector: 'm-mixer-track',
  imports: [SliderComponent, VisibleDirective, ActiveDirective, MixerEqComponent, SelectDirective, ChangedDirective, MixerFxComponent, MixerSendComponent, UvmeterComponent],
  templateUrl: './mixer-track.component.html',
  styleUrl: './mixer-track.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixerTrackComponent {

  readonly track = input.required<TrackState>();

  readonly hasEq = computed(() => (this.track() as any as TrackWithEqState).eq != undefined);
  readonly hasFx = computed(() => (this.track() as any as TrackWithFxState).fx != undefined);
  readonly hasName = computed(() => (this.track() as any as NamedTrackState).name != undefined);
  readonly hasRouting = computed(() => (this.track() as any as RoutedTrackState).groupId != undefined);
  readonly hasSendFx = computed(() => (this.track() as any as TrackWithSendFxState).sendFx != undefined);
  readonly hasSoloMute = computed(() => (this.track() as any as MutableTrackState).muted != undefined);
  readonly hasVolpan = computed(() => (this.track() as any as VolpanTrackState).volume != undefined);
  readonly hasUv = computed(() => this.track().type !== TrackType.MIDI);
  readonly uvPeak = signal(0);

  private readonly store = inject(Store);
  readonly visibility = this.store.selectSignal(mixVisibilitySelector);
  private readonly groupTracks = this.store.selectSignal(mixGroupTracksSelector);
  private readonly soloActivated = this.store.selectSignal(mixSoloActiveSelector);

  readonly name = computed(() => {
    const n = this.track() as any as NamedTrackState;
    return n.name ?? '';
  });
  readonly pan = computed(() => {
    const vp = this.track() as any as VolpanTrackState;
    return vp?.pan ?? 0;
  });
  readonly volume = computed(() => {
    const vp = this.track() as any as VolpanTrackState;
    return vp?.volume ?? 0;
  });
  readonly routedTrack = computed(() => {
    const r = this.track() as any as RoutedTrackState;
    return r.groupId ?? MASTER_TRACK_ID;
  });
  readonly isRouted = computed(() => {
    const r = this.track() as any as RoutedTrackState;
    return r.groupId != undefined && r.groupId !== MASTER_TRACK_ID;
  });
  readonly availableRoutes = computed(() => {
    const ret: { key: string, value: string }[] = [
      { key: MASTER_TRACK_ID, value: MASTER_TRACK_ID },
      ...this.groupTracks().map(it => ({ key: it.id, value: it.name.length > 0 ? it.name : it.id })),
    ];
    return ret;
  });
  readonly hasAvailableRoutes = computed(() => this.availableRoutes().length > 1);
  readonly solo = computed(() => {
    const s = (this.track() as any as MutableTrackState).solo;
    return s ?? false;
  });
  readonly muted = computed(() => {
    const m = (this.track() as any as MutableTrackState).muted;
    return (m ?? false) || (this.soloActivated() && !this.solo());
  });
  readonly canDelete = computed(() => this.track().type !== TrackType.MASTER);

  private readonly mixService = inject(MixService);

  constructor() {
    // window.setInterval(() => { this.uvPeak.set(Math.random()) }, 100);
  }

  onChangeRoute(route: string) {
    this.mixService.routeAudioTrack(this.track().id, route);
  }

  onSolo() {
    this.mixService.setTrackSolo(this.track().id, !this.solo());
  }

  onMute() {
    this.mixService.setTrackMuted(this.track().id, (this.track() as any as MutableTrackState).muted === false);
  }

  onSetVolume(volume: number) {
    this.mixService.setTrackVolume(this.track().id, volume);
  }

  onSetPan(pan: number) {
    this.mixService.setTrackPan(this.track().id, pan);
  }

  onNameChanged(name: string) {
    this.mixService.setTrackName(this.track().id, name);
  }

  onDelete() {
    this.mixService.removeTrack(this.track().id);
  }
}
