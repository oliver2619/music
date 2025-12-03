import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { Store } from '@ngrx/store';
import { WaveEditorService } from '../../../service/wave-editor.service';
import { WaveEditorFileState } from '../../../state/wave-editor.state';
import { QuerySaveEvent } from '../../../event/query-save.event';
import { waveEditorSelector } from '../../../selector/wave-editor.selector';
import { WaveEditorNewComponent, WaveEditorNewFormModel } from "../wave-editor-new/wave-editor-new.component";
import { ModalService } from '../../../service/modal.service';
import { I18nService } from '@pluto-ngtools/i18n';
import { ActiveDirective } from '../../../directive/active.directive';

@Component({
  selector: 'm-wave-editor-file-list',
  imports: [ActiveDirective],
  templateUrl: './wave-editor-file-list.component.html',
  styleUrl: './wave-editor-file-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorFileListComponent {

  readonly load = output<void>();
  readonly saveAs = output<void>();
  readonly querySave = output<QuerySaveEvent>();

  private readonly store = inject(Store);
  private readonly state = this.store.selectSignal(waveEditorSelector);
  private readonly waveEditorService = inject(WaveEditorService);
  private readonly modalService = inject(ModalService);
  private readonly i18nService = inject(I18nService);

  readonly files = computed(() => Array.from(Object.values(this.state().files)).sort((i1, i2) => i1.name.localeCompare(i2.name)));
  readonly selected = computed(() => {
    const selected = this.state().selected;
    return selected == undefined ? selected : this.state().files[selected];
  });
  readonly hasSelection = computed(() => this.selected() != undefined);
  readonly isModified = computed(() => this.selected()?.isModified ?? false);

  onClose() {
    const selected = this.selected();
    if (selected != undefined) {
      if (selected.isModified) {
        const ev = new QuerySaveEvent();
        this.querySave.emit(ev);
        if (ev.isAborted) {
          return;
        }
      }
      this.waveEditorService.closeSelected();
    }
  }

  onLoad() {
    this.load.emit();
  }

  onNew() {
    this.modalService.showDialog<WaveEditorNewFormModel, WaveEditorNewComponent>(WaveEditorNewComponent, this.i18nService.get('waveEditorNew')).then(result => {
      if (result != undefined) {
        this.waveEditorService.new({ name: result.name, length: result.length, samplerate: Number.parseInt(result.samplerate), stereo: result.stereo });
      }
    });
  }

  onSave() {
    const selected = this.selected();
    if (selected != undefined) {
      if (selected.isSaved) {
        this.waveEditorService.saveSelected();
      } else {
        this.saveAs.emit();
      }
    }
  }

  onSaveAs() {
    this.saveAs.emit();
  }

  onSelect(file: WaveEditorFileState) {
    this.waveEditorService.select(file.name);
  }

}
