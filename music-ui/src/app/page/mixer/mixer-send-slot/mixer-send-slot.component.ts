import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { SpinButtonComponent } from "../../../element/spin-button/spin-button.component";
import { ActiveDirective } from "../../../directive/active.directive";
import { Store } from '@ngrx/store';
import { mixFxTracksSelector } from '../../../selector/mix.selector';
import { I18nDirective } from "@pluto-ngtools/i18n";
import { SelectDirective } from '../../../directive/select.directive';
import { ChangedDirective } from "../../../directive/changed.directive";

@Component({
  selector: 'm-mixer-send-slot',
  imports: [SpinButtonComponent, ActiveDirective, I18nDirective, SelectDirective, ChangedDirective],
  templateUrl: './mixer-send-slot.component.html',
  styleUrl: './mixer-send-slot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixerSendSlotComponent {

  readonly post = input.required<boolean>();
  readonly value = input.required<number>();
  readonly trackId = input.required<string>();

  readonly postChanged = output<boolean>();
  readonly valueChanged = output<number>();
  readonly trackIdChanged = output<string>();

  private readonly store = inject(Store);
  private readonly fxTracks = this.store.selectSignal(mixFxTracksSelector);
  readonly availableEffects = computed(() => this.fxTracks().map(it => ({ key: it.id, value: it.name.length === 0 ? it.id : it.name })));
  readonly hasAvailableEffects = computed(() => this.availableEffects().length > 0);
  readonly active = computed(() => this.trackId().length > 0);

  onSetPost(post: boolean) {
    this.postChanged.emit(post);
  }

  onChangeValue(v: number) {
    this.valueChanged.emit(v);
  }

  onChangeTrack(trackId: string) {
    this.trackIdChanged.emit(trackId);
  }
}
