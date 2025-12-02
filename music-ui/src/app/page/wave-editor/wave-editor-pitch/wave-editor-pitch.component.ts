import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { WaveEditorService } from '../../../service/wave-editor.service';
import { Store } from '@ngrx/store';
import { waveEditorCurrentPitchSelector } from '../../../selector/wave-editor.selector';
import { waveEditorActions } from '../../../action/wave-editor.action';
import { NumberChangedDirective } from "../../../directive/number-changed.directive";
import { SliderGridComponent } from "../../../element/slider-grid/slider-grid.component";

@Component({
  selector: 'm-wave-editor-pitch',
  imports: [NgClass, NumberChangedDirective, SliderGridComponent],
  templateUrl: './wave-editor-pitch.component.html',
  styleUrl: './wave-editor-pitch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorPitchComponent {

  private readonly store = inject(Store);
  private readonly pitchSpeed = this.store.selectSignal(waveEditorCurrentPitchSelector);

  readonly snapEnabled = computed(() => this.pitchSpeed()?.snap ?? false);
  readonly pitch = computed(() => this.pitchSpeed()?.pitch ?? 0);
  readonly pitch12Rounded = computed(() => Math.round(this.pitch() * 12_000) / 1000);
  readonly speed = computed(() => this.pitchSpeed()?.speed ?? 0);

  private readonly waveEditorService = inject(WaveEditorService);

  onApply() {
    this.waveEditorService.applyPitch();
  }

  onChangeXY(ev: { readonly x: number, readonly y: number }) {
    this.waveEditorService.setPitch(ev.y, ev.x);
  }

  onPitchChanged(value: number) {
    const v = Math.max(-1, Math.min(1, value / 12));
    this.waveEditorService.setPitch(v, this.pitchSpeed()?.speed ?? 0);
  }

  onReset() {
    this.waveEditorService.setPitch(0, 0);
  }

  onSpeedChanged(speed: number) {
    this.waveEditorService.setPitch(this.pitchSpeed()?.pitch ?? 0, speed);
  }

  onToggleSnap() {
    this.store.dispatch(waveEditorActions.setSnapPitch({ enabled: !this.snapEnabled() }));
  }
}
