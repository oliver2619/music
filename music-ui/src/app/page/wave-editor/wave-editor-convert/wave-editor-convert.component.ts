import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { I18nDirective } from '@pluto-ngtools/i18n';
import { ModalComponentBase } from '../../../service/modal.service';
import { SelectSamplerateDirective } from '../../../directive/select-samplerate.directive';
import { ToggleButtonDirective } from '../../../directive/toggle-button.directive';
import { Store } from '@ngrx/store';
import { mixSamplerateSelector } from '../../../selector/mix.selector';
import { form, required, Field } from '@angular/forms/signals';

export interface WaveEditorConvertFormModel {
  samplerate: string;
  stereo: boolean;
}

@Component({
  selector: 'm-wave-editor-convert',
  imports: [I18nDirective, SelectSamplerateDirective, ToggleButtonDirective, Field],
  templateUrl: './wave-editor-convert.component.html',
  styleUrl: './wave-editor-convert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorConvertComponent implements ModalComponentBase<WaveEditorConvertFormModel> {

  private readonly store = inject(Store);
  private readonly globalSamplerate = this.store.selectSignal(mixSamplerateSelector);

  private readonly formModel = signal<WaveEditorConvertFormModel>({
    samplerate: String(this.globalSamplerate()),
    stereo: true,
  });

  readonly form = form(this.formModel, value => {
    required(value.samplerate);
  });

  readonly valid = this.form().valid;

  getValue(): WaveEditorConvertFormModel {
    return this.formModel();
  }

}
