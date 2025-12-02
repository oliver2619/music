import { ChangeDetectionStrategy, Component } from '@angular/core';
import { I18nDirective } from '@pluto-ngtools/i18n';

@Component({
  selector: 'm-settings-midi',
  imports: [I18nDirective],
  templateUrl: './settings-midi.component.html',
  styleUrl: './settings-midi.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsMidiComponent {

}
