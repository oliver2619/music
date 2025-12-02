import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { waveEditorCurrentSelector, waveEditorEditSelector } from '../../../selector/wave-editor.selector';
import { WaveEditorService } from '../../../service/wave-editor.service';
import { settingsUnitSelector } from '../../../selector/settings.selector';
import { ModalService } from '../../../service/modal.service';
import { WaveEditorConvertComponent, WaveEditorConvertFormValue } from '../wave-editor-convert/wave-editor-convert.component';
import { I18nService } from '@pluto-ngtools/i18n';
import { waveEditorActions } from '../../../action/wave-editor.action';
import { ActiveDirective } from "../../../directive/active.directive";

@Component({
  selector: 'm-wave-editor-actions',
  imports: [ActiveDirective],
  templateUrl: './wave-editor-actions.component.html',
  styleUrl: './wave-editor-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorActionsComponent {

  private readonly store = inject(Store);
  private readonly waveEditor = this.store.selectSignal(waveEditorCurrentSelector);
  private readonly waveEditorService = inject(WaveEditorService);
  private readonly modalService = inject(ModalService);
  private readonly i18nService = inject(I18nService);
  private readonly editorSettings = this.store.selectSignal(waveEditorEditSelector);

  readonly unit = this.store.selectSignal(settingsUnitSelector);
  readonly canUndo = computed(() => this.waveEditor()?.canUndo ?? false);
  readonly canRedo = computed(() => this.waveEditor()?.canRedo ?? false);
  readonly isStereo = computed(() => this.waveEditor()?.isStereo ?? false);
  readonly hasSelection = computed(() => {
    const sel = this.waveEditor()?.selection;
    return sel == undefined ? false : sel.end > sel.start;
  });
  readonly fxVisible = computed(() => this.editorSettings().fxVisible);
  readonly pitchVisible = computed(() => this.editorSettings().pitchVisible);

  onAppendSilence() {
    this.waveEditorService.appendSilence();
  }

  onConvert() {
    this.modalService.showDialog<WaveEditorConvertFormValue, WaveEditorConvertComponent>(WaveEditorConvertComponent, this.i18nService.get('waveEditorConvert')).then(result => {
      if (result != undefined) {
        this.waveEditorService.convert({ samplerate: Number.parseInt(result.samplerate), stereo: result.stereo });
      }
    });
  }

  onCopy() {
    this.waveEditorService.copy();
  }

  onCut() {
    this.waveEditorService.cut();
  }

  onDelete() {
    this.waveEditorService.delete();
  }

  onFadeIn() {
    this.waveEditorService.fadeIn();
  }

  onFadeOut() {
    this.waveEditorService.fadeOut();
  }

  onFlip() {
    this.waveEditorService.flip();
  }

  onFx() {
    this.store.dispatch(waveEditorActions.showFx({ enabled: !this.fxVisible() }));
  }

  onInsertSilence() {
    this.waveEditorService.insertSilence();
  }

  onNormalize() {
    this.waveEditorService.normalize();
  }

  onNormalizeEach() {
    this.waveEditorService.normalizeEach();
  }

  onPaste() {
    this.waveEditorService.paste();
  }

  onPitch() {
    this.store.dispatch(waveEditorActions.showPitch({ enabled: !this.pitchVisible() }));
  }

  onRedo() {
    this.waveEditorService.redo();
  }

  onRevert() {
    this.waveEditorService.revert();
  }

  onSetSilence() {
    this.waveEditorService.setSilence();
  }

  onSwap() {
    this.waveEditorService.swap();
  }

  onTrim() {
    this.waveEditorService.trim();
  }

  onUndo() {
    this.waveEditorService.undo();
  }

}
