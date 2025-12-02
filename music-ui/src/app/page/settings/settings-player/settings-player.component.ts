import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nDirective } from '@pluto-ngtools/i18n';
import { SelectSamplerateDirective } from "../../../directive/select-samplerate.directive";
import { Store } from '@ngrx/store';
import { settingsPlayersSelector } from '../../../selector/settings.selector';

@Component({
  selector: 'm-settings-player',
  imports: [I18nDirective, SelectSamplerateDirective],
  templateUrl: './settings-player.component.html',
  styleUrl: './settings-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPlayerComponent {

  private readonly store = inject(Store);
  private readonly devicesMap = this.store.selectSignal(settingsPlayersSelector);
  readonly devices = computed(() => Object.entries(this.devicesMap()).map(([id, caps]) => ({ id, name: caps.name })));
}
