import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ModalComponentBase } from '../../../service/modal.service';
import { ToggleButtonDirective } from '../../../directive/toggle-button.directive';
import { convertUnitToNumSamples } from '../../../utils';
import { SelectUnitDirective } from "../../../directive/select-unit.directive";
import { SelectSamplerateDirective } from "../../../directive/select-samplerate.directive";
import { Store } from '@ngrx/store';
import { mixBpmSelector, mixSamplerateSelector } from '../../../selector/mix.selector';
import { settingsUnitSelector } from '../../../selector/settings.selector';
import { I18nDirective } from '@pluto-ngtools/i18n';
import { form, Field, required, min, max } from '@angular/forms/signals';
import { ValidDirective } from "../../../directive/valid.directive";

export interface WaveEditorNewFormModel {
  name: string;
  samplerate: string;
  stereo: boolean;
  length: number;
}

@Component({
  selector: 'm-wave-editor-new',
  imports: [I18nDirective, ToggleButtonDirective, SelectUnitDirective, SelectSamplerateDirective, Field, ValidDirective],
  templateUrl: './wave-editor-new.component.html',
  styleUrl: './wave-editor-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorNewComponent implements ModalComponentBase<WaveEditorNewFormModel> {

  private static sequence = 0;

  private readonly store = inject(Store);
  private readonly globalSamplerate = this.store.selectSignal(mixSamplerateSelector);
  private readonly globalBpm = this.store.selectSignal(mixBpmSelector);
  private readonly unit = this.store.selectSignal(settingsUnitSelector);

  private readonly formModel = signal<WaveEditorNewFormModel>({
    length: 0,
    name: `newSample${++WaveEditorNewComponent.sequence}`,
    samplerate: String(this.globalSamplerate()),
    stereo: true
  }
  );

  readonly form = form(this.formModel, value => {
    required(value.length);
    required(value.name);
    min(value.length, 0);
    max(value.length, 100000);
  });

  readonly valid = this.form().valid;

  getValue(): WaveEditorNewFormModel {
    const ret = this.formModel();
    return {
      ...ret,
      length: convertUnitToNumSamples(ret.length, { bpm: this.globalBpm(), samplerate: Number.parseInt(ret.samplerate), unit: this.unit() }),
    };
  }
}
