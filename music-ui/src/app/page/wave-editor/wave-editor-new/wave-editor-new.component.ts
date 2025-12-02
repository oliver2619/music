import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalComponentBase } from '../../../service/modal.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleButtonDirective } from '../../../directive/toggle-button.directive';
import { convertUnitToNumSamples, formGroupValidChange } from '../../../utils';
import { SelectUnitDirective } from "../../../directive/select-unit.directive";
import { SelectSamplerateDirective } from "../../../directive/select-samplerate.directive";
import { Store } from '@ngrx/store';
import { mixBpmSelector, mixSamplerateSelector } from '../../../selector/mix.selector';
import { settingsUnitSelector } from '../../../selector/settings.selector';
import { I18nDirective } from '@pluto-ngtools/i18n';

export interface WaveEditorNewFormValue {
  name: string;
  samplerate: string;
  stereo: boolean;
  length: number;
}

@Component({
  selector: 'm-wave-editor-new',
  imports: [I18nDirective, ReactiveFormsModule, ToggleButtonDirective, SelectUnitDirective, SelectSamplerateDirective],
  templateUrl: './wave-editor-new.component.html',
  styleUrl: './wave-editor-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorNewComponent implements ModalComponentBase<WaveEditorNewFormValue> {

  private static sequence = 0;

  private readonly store = inject(Store);
  private readonly globalSamplerate = this.store.selectSignal(mixSamplerateSelector);
  private readonly globalBpm = this.store.selectSignal(mixBpmSelector);
  private readonly unit = this.store.selectSignal(settingsUnitSelector);

  readonly formGroup = (() => {
    const fb = new FormBuilder().nonNullable;
    return fb.group({
      name: fb.control(`newSample${++WaveEditorNewComponent.sequence}`, [Validators.required]),
      samplerate: fb.control(String(this.globalSamplerate()), [Validators.required]),
      stereo: fb.control(true),
      length: fb.control(0, [Validators.required, Validators.min(0), Validators.max(100000)]),
    })
  })();

  readonly validChange = formGroupValidChange(this.formGroup);

  get stereoControl(): FormControl<boolean> {
    return this.formGroup.controls['stereo'];
  }

  getValue(): WaveEditorNewFormValue {
    const ret: WaveEditorNewFormValue = this.formGroup.value as Required<WaveEditorNewFormValue>;
    return {
      ...ret,
      length: convertUnitToNumSamples(ret.length, { bpm: this.globalBpm(), samplerate: Number.parseInt(ret.samplerate), unit: this.unit() }),
    };
  }
}
