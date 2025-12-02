import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { SelectSnapDirective } from "../../../directive/select-snap.directive";
import { Store } from '@ngrx/store';
import { waveEditorCurrentSelector, waveEditorModeSelector, waveEditorSnapSelector, waveEditorZoomSelector } from '../../../selector/wave-editor.selector';
import { settingsUnitSelector } from '../../../selector/settings.selector';
import { convertNumSamplesUsingUnit, convertUnitToNumSamples } from '../../../utils';
import { mixBpmSelector } from '../../../selector/mix.selector';
import { ChangedDirective } from "../../../directive/changed.directive";
import { DecimalPipe } from '@angular/common';
import { waveEditorActions } from '../../../action/wave-editor.action';
import { NumberChangedDirective } from "../../../directive/number-changed.directive";
import { ActiveDirective } from "../../../directive/active.directive";

const maxZoom = 16;

@Component({
  selector: 'm-wave-editor-selection',
  imports: [SelectSnapDirective, ChangedDirective, NumberChangedDirective, DecimalPipe, ActiveDirective],
  templateUrl: './wave-editor-selection.component.html',
  styleUrl: './wave-editor-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorSelectionComponent {

  readonly zoomShowSelection = output<void>();
  readonly zoomShowAll = output<void>();
  readonly zoomSet = output<number>();
  readonly zoomIn = output<void>();
  readonly zoomOut = output<void>();

  private readonly store = inject(Store);
  private readonly wave = this.store.selectSignal(waveEditorCurrentSelector);
  private readonly unit = this.store.selectSignal(settingsUnitSelector);
  private readonly bpm = this.store.selectSignal(mixBpmSelector);

  readonly mode = this.store.selectSignal(waveEditorModeSelector);

  readonly selectionStart = computed(() => {
    const wave = this.wave();
    if (wave == undefined) {
      return 0;
    }
    return convertNumSamplesUsingUnit(wave.selection.start, { unit: this.unit(), samplerate: wave.sampleRate, bpm: this.bpm() });
  });

  readonly selectionEnd = computed(() => {
    const wave = this.wave();
    if (wave == undefined) {
      return 0;
    }
    return convertNumSamplesUsingUnit(wave.selection.end, { unit: this.unit(), samplerate: wave.sampleRate, bpm: this.bpm() });
  });

  readonly selectionLength = computed(() => {
    const wave = this.wave();
    if (wave == undefined) {
      return 0;
    }
    return convertNumSamplesUsingUnit(wave.selection.end - wave.selection.start, { unit: this.unit(), samplerate: wave.sampleRate, bpm: this.bpm() });
  });

  readonly hasSelection = computed(() => this.selectionEnd() !== 0 || this.selectionStart() !== 0);

  readonly isAllSelected = computed(() => {
    const wave = this.wave();
    if (wave == undefined) {
      return false;
    } else {
      return wave.selection.start === 0 && wave.selection.end === wave.numberOfSamples;
    }
  });

  readonly isEndSelected = computed(() => {
    const wave = this.wave();
    if (wave == undefined) {
      return false;
    } else {
      return wave.selection.start === wave.numberOfSamples && wave.selection.end === wave.numberOfSamples;
    }
  });

  private readonly snap = this.store.selectSignal(waveEditorSnapSelector);
  readonly snapDisplay = computed(() => this.snap() == undefined ? '' : String(this.snap()));

  readonly zoom = this.store.selectSignal(waveEditorZoomSelector);
  readonly canZoomIn = computed(() => this.zoom() < maxZoom);

  onClearSelection() {
    this.store.dispatch(waveEditorActions.selectRange({ start: 0, end: 0 }));
  }

  onEditModeSelect() {
    this.store.dispatch(waveEditorActions.setMode({ mode: 'select' }));
  }

  onEditModeScroll() {
    this.store.dispatch(waveEditorActions.setMode({ mode: 'scroll' }));
  }

  onEditModeZoom() {
    this.store.dispatch(waveEditorActions.setMode({ mode: 'zoom' }));
  }

  onSelectAll() {
    const wave = this.wave();
    if (wave != undefined) {
      this.store.dispatch(waveEditorActions.selectRange({ start: 0, end: wave.numberOfSamples }));
    }
  }

  onSelectEnd() {
    const wave = this.wave();
    if (wave != undefined) {
      this.store.dispatch(waveEditorActions.selectRange({ start: wave.numberOfSamples, end: wave.numberOfSamples }));
    }
  }

  onSelectionEndChange(end: number) {
    const wave = this.wave();
    if (wave != undefined) {
      const pos = convertUnitToNumSamples(end, { unit: this.unit(), samplerate: wave.sampleRate, bpm: this.bpm() });
      this.store.dispatch(waveEditorActions.selectRange({ start: Math.min(pos, wave.selection.start), end: pos }));
    }
  }

  onSelectionLengthChange(length: number) {
    const wave = this.wave();
    if (wave != undefined) {
      const pos = convertUnitToNumSamples(length, { unit: this.unit(), samplerate: wave.sampleRate, bpm: this.bpm() });
      this.store.dispatch(waveEditorActions.selectRange({ start: wave.selection.start, end: wave.selection.start + Math.max(0, pos) }));
    }
  }

  onSelectionStartChange(start: number) {
    const wave = this.wave();
    if (wave != undefined) {
      const pos = convertUnitToNumSamples(start, { unit: this.unit(), samplerate: wave.sampleRate, bpm: this.bpm() });
      this.store.dispatch(waveEditorActions.selectRange({ start: pos, end: Math.max(pos, wave.selection.end) }));
    }
  }

  onSnapChange(bars: string) {
    if (bars === '') {
      this.store.dispatch(waveEditorActions.setSnap({ bars: undefined }));
    } else {
      this.store.dispatch(waveEditorActions.setSnap({ bars: Number.parseFloat(bars) }));
    }
  }

  onZoomIn() {
    this.zoomIn.emit();
  }

  onZoomOut() {
    this.zoomOut.emit();
  }

  onZoomReset() {
    this.zoomSet.emit(1);
  }

  onZoomShowSelection() {
    this.zoomShowSelection.emit();
  }

  onZoomShowAll() {
    this.zoomShowAll.emit();
  }
}
