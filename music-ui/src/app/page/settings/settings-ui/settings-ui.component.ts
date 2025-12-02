import { ChangeDetectionStrategy, Component } from '@angular/core';
import { I18nDirective } from '@pluto-ngtools/i18n';
import { SelectUnitDirective } from "../../../directive/select-unit.directive";

@Component({
  selector: 'm-settings-ui',
  imports: [I18nDirective, SelectUnitDirective],
  templateUrl: './settings-ui.component.html',
  styleUrl: './settings-ui.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsUiComponent {

}
