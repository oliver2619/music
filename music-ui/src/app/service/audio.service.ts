import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { settingsActions } from '../action/settings.action';

@Injectable({
  providedIn: 'root',
})
export class AudioService {

  private readonly store = inject(Store);

  initDevices(): Promise<void> {
    this.store.dispatch(settingsActions.setAudioDevices({
      players: {
        id1: {
          maxSamplerate: 44100,
          name: 'Player',
        },
      },
      recorders: {
        id2: {
          maxSamplerate: 44100,
          name: 'Recorder',
        },
      }
    }));
    return Promise.resolve();
  }

  setPlaybackVolume(volume: number) {
    // TODO call backend
    this.store.dispatch(settingsActions.setPlaybackVolume({ value: volume }));

  }
}
