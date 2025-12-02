import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { mixActions } from '../action/mix.action';
import { TrackType } from '../model/track-type';

@Injectable({
  providedIn: 'root',
})
export class MixService {

  private readonly store = inject(Store);

  addTrack(trackType: TrackType) {
    // TODO call backend
    this.store.dispatch(mixActions.addTrack({ trackType }));
  }

  removeTrack(trackId: string) {
    // TODO call backend
    this.store.dispatch(mixActions.removeTrack({ trackId }));
  }

  routeAudioTrack(trackId: string, targetTrackId: string) {
    // TODO call backend
    this.store.dispatch(mixActions.setAudioTrackRoute({ trackId, targetTrackId, }));
  }

  setTrackEq(trackId: string, slot: number, value: number) {
    // TODO call backend
    this.store.dispatch(mixActions.setTrackEq({ trackId, slot, value }));
  }

  setTrackFxOn(trackId: string, slot: number, on: boolean) {
    // TODO call backend
    this.store.dispatch(mixActions.setTrackFx({ slot, trackId, on, }));
  }

  setTrackMuted(trackId: string, muted: boolean) {
    // TODO call backend
    this.store.dispatch(mixActions.setTrackMute({ trackId, on: muted, }));
  }

  setTrackName(trackId: string, name: string) {
    this.store.dispatch(mixActions.setTrackName({ trackId, name, }));
  }

  setTrackPan(trackId: string, pan: number) {
    // TODO call backend
    this.store.dispatch(mixActions.setTrackVolpan({ trackId, pan, }));
  }

  setTrackSendFx(trackId: string, slot: number, fxTrackId: string) {
    //  TODO call backend
    this.store.dispatch(mixActions.setTrackSendFx({ slot, trackId, fxTrackId, }));
  }

  setTrackSendFxAmount(trackId: string, slot: number, amount: number) {
    //  TODO call backend
    this.store.dispatch(mixActions.setTrackSendFx({ slot, trackId, amount, }));
  }

  setTrackSendFxPost(trackId: string, slot: number, post: boolean) {
    //  TODO call backend
    this.store.dispatch(mixActions.setTrackSendFx({ slot, trackId, post, }));
  }

  setTrackSolo(trackId: string, solo: boolean) {
    // TODO call backend
    this.store.dispatch(mixActions.setTrackSolo({ trackId, on: solo, }));
  }

  setTrackVolume(trackId: string, volume: number) {
    // TODO call backend
    this.store.dispatch(mixActions.setTrackVolpan({ trackId, volume, }));
  }
}
