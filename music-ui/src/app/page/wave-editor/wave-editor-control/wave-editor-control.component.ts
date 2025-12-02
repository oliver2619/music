import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { waveEditorControlSelector, waveEditorCurrentSelector } from '../../../selector/wave-editor.selector';
import { settingsPlayerVolumeSelector, settingsUnitSelector } from '../../../selector/settings.selector';
import { mixBpmSelector } from '../../../selector/mix.selector';
import { convertNumSamplesUsingUnit } from '../../../utils';
import { WaveEditorPlaybackState } from '../../../state/wave-editor.state';
import { WaveEditorService } from '../../../service/wave-editor.service';
import { SliderComponent } from "../../../element/slider/slider.component";
import { DbPipe } from '../../../pipe/db.pipe';
import { PositionPipe } from "../../../pipe/position.pipe";
import { SelectUnitDirective } from '../../../directive/select-unit.directive';
import { AudioService } from '../../../service/audio.service';

@Component({
  selector: 'm-wave-editor-control',
  imports: [NgClass, SliderComponent, DecimalPipe, DbPipe, PositionPipe, SelectUnitDirective],
  templateUrl: './wave-editor-control.component.html',
  styleUrl: './wave-editor-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorControlComponent {

  private readonly store = inject(Store);
  private readonly wave = this.store.selectSignal(waveEditorCurrentSelector);
  private readonly unit = this.store.selectSignal(settingsUnitSelector);
  private readonly bpm = this.store.selectSignal(mixBpmSelector);

  readonly samplerate = computed(() => {
    const wave = this.wave();
    if (wave == undefined) {
      return 44100;
    } else {
      return wave.sampleRate;
    }
  });

  readonly length = computed<number | undefined>(() => {
    const wave = this.wave();
    if (wave == undefined) {
      return undefined;
    } else {
      return convertNumSamplesUsingUnit(wave.numberOfSamples, { unit: this.unit(), samplerate: wave.sampleRate, bpm: this.bpm() });
    }
  });

  private readonly control = this.store.selectSignal(waveEditorControlSelector);

  readonly canRecord = signal(true);
  readonly isPlaying = computed(() => this.control().state === WaveEditorPlaybackState.PLAYBACK);
  readonly isRecording = computed(() => this.control().state === WaveEditorPlaybackState.RECORDING);
  readonly isLooping = computed(() => this.control().isLooping);
  readonly volume = this.store.selectSignal(settingsPlayerVolumeSelector);

  private readonly waveEditorService = inject(WaveEditorService);
  private readonly audioService = inject(AudioService);

  onPlay() {
    const wave = this.wave();
    if (wave != undefined) {
      this.waveEditorService.play(Math.max(0, Math.min(wave.numberOfSamples, wave.selection.start)));
    }
  }

  onRecord() {
    this.waveEditorService.record();
  }

  onStop() {
    this.waveEditorService.stop();
  }

  onToggleLoop() {
    if (this.isLooping()) {
      this.waveEditorService.setLoop(undefined);
    } else {
      const wave = this.wave();
      if (wave != undefined) {
        if (wave.selection.end > wave.selection.start) {
          this.waveEditorService.setLoop({ start: wave.selection.start, end: wave.selection.end });
        } else {
          this.waveEditorService.setLoop({ start: 0, end: wave.numberOfSamples });
        }
      }
    }
  }

  onChangeVolume(amp: number) {
    this.audioService.setPlaybackVolume(amp);
  }
}
