import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, viewChild } from '@angular/core';
import { WaveEditorFileListComponent } from "./wave-editor-file-list/wave-editor-file-list.component";
import { QuerySaveEvent } from '../../event/query-save.event';
import { WaveEditorActionsComponent } from "./wave-editor-actions/wave-editor-actions.component";
import { WaveEditorSelectionComponent } from "./wave-editor-selection/wave-editor-selection.component";
import { WaveEditorControlComponent } from "./wave-editor-control/wave-editor-control.component";
import { WaveEditorWaveComponent } from "./wave-editor-wave/wave-editor-wave.component";
import { WaveEditorPitchComponent } from "./wave-editor-pitch/wave-editor-pitch.component";
import { WaveEditorFxComponent } from "./wave-editor-fx/wave-editor-fx.component";
import { WaveEditorService } from '../../service/wave-editor.service';
import { Store } from '@ngrx/store';
import { waveEditorEditSelector } from '../../selector/wave-editor.selector';

@Component({
  selector: 'm-wave-editor',
  imports: [WaveEditorFileListComponent, WaveEditorActionsComponent, WaveEditorControlComponent, WaveEditorWaveComponent, WaveEditorPitchComponent, WaveEditorFxComponent, WaveEditorSelectionComponent],
  templateUrl: './wave-editor.component.html',
  styleUrl: './wave-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorComponent implements OnDestroy {

  private readonly store = inject(Store);
  private readonly editSettings = this.store.selectSignal(waveEditorEditSelector);

  readonly fxVisible = computed(() => this.editSettings().fxVisible);
  readonly pitchVisible = computed(() => this.editSettings().pitchVisible);

  private readonly waveEditorService = inject(WaveEditorService);
  private readonly wave = viewChild.required(WaveEditorWaveComponent);

  ngOnDestroy() {
    this.waveEditorService.stop();
  }

  onLoadFile() {

  }

  onQuerySave(ev: QuerySaveEvent) {
    // TODO save as
    ev.abort();
  }

  onSaveFileAs() {

  }

  onZoomSet(zoom: number) {
    this.wave().zoomSet(zoom);
  }

  onZoomShowAll() {
    this.wave().zoomShowAll();
  }

  onZoomShowSelection() {
    this.wave().zoomShowSelection();
  }

  onZoomIn() {
    this.wave().zoomIn();
  }

  onZoomOut() {
    this.wave().zoomOut();
  }
}
