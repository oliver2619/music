import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { I18nDirective } from '@pluto-ngtools/i18n';
import { ModalComponentBase } from '../../../service/modal.service';
import { SelectSamplerateDirective } from '../../../directive/select-samplerate.directive';
import { ToggleButtonDirective } from '../../../directive/toggle-button.directive';
import { Store } from '@ngrx/store';
import { mixSamplerateSelector } from '../../../selector/mix.selector';
import { formGroupValidChange } from '../../../utils';

export interface WaveEditorConvertFormValue {
  samplerate: string;
  stereo: boolean;
}

@Component({
  selector: 'm-wave-editor-convert',
  imports: [ReactiveFormsModule, I18nDirective, SelectSamplerateDirective, ToggleButtonDirective],
  templateUrl: './wave-editor-convert.component.html',
  styleUrl: './wave-editor-convert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorConvertComponent implements ModalComponentBase<WaveEditorConvertFormValue> {

  private readonly store = inject(Store);
  private readonly globalSamplerate = this.store.selectSignal(mixSamplerateSelector);

  readonly formGroup = (() => {
    const fb = new FormBuilder().nonNullable;
    return fb.group({
      samplerate: fb.control(String(this.globalSamplerate()), [Validators.required]),
      stereo: fb.control(true),
    })
  })();

  readonly validChange = formGroupValidChange(this.formGroup);

  get stereoControl(): FormControl<boolean> {
    return this.formGroup.controls['stereo'];
  }

  getValue(): WaveEditorConvertFormValue {
    return this.formGroup.value as Required<WaveEditorConvertFormValue>;
  }

}
