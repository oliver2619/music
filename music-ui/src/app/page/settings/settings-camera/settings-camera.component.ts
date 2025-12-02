import { ChangeDetectionStrategy, Component } from '@angular/core';
import { I18nDirective } from '@pluto-ngtools/i18n';

@Component({
  selector: 'm-settings-camera',
  imports: [I18nDirective],
  templateUrl: './settings-camera.component.html',
  styleUrl: './settings-camera.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsCameraComponent {

}
