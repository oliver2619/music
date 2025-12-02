import { ChangeDetectionStrategy, Component } from '@angular/core';
import { I18nDirective } from "@pluto-ngtools/i18n";
import { RouterLinkActive, RouterModule } from "@angular/router";

@Component({
  selector: 'm-settings',
  imports: [I18nDirective, RouterModule, RouterLinkActive],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {

}
