import { ChangeDetectionStrategy, Component } from '@angular/core';
import { I18nDirective } from '@pluto-ngtools/i18n';
import { SelectSamplerateDirective } from "../../../directive/select-samplerate.directive";

@Component({
  selector: 'm-settings-recorder',
  imports: [I18nDirective, SelectSamplerateDirective],
  templateUrl: './settings-recorder.component.html',
  styleUrl: './settings-recorder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsRecorderComponent {

}
