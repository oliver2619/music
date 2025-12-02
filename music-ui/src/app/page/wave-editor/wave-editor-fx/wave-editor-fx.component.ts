import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ChangedDirective } from "../../../directive/changed.directive";
import { NgClass } from '@angular/common';
import { WaveEditorService } from '../../../service/wave-editor.service';
import { Store } from '@ngrx/store';
import { waveEditorCurrentFxSelector } from '../../../selector/wave-editor.selector';
import { effectNamesSelector } from '../../../selector/effects.selector';
import { SelectDirective } from '../../../directive/select.directive';
import { FxParamGridComponent } from "../../../composite/fx-param-grid/fx-param-grid.component";

@Component({
  selector: 'm-wave-editor-fx',
  imports: [ChangedDirective, NgClass, SelectDirective, FxParamGridComponent],
  templateUrl: './wave-editor-fx.component.html',
  styleUrl: './wave-editor-fx.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorFxComponent {

  private readonly store = inject(Store);
  private readonly effect = this.store.selectSignal(waveEditorCurrentFxSelector);

  private readonly _effectNamesUnsorted = this.store.selectSignal(effectNamesSelector);
  readonly effectNames = computed(() => this._effectNamesUnsorted().sort((i1, i2) => i1.localeCompare(i2)));
  readonly enabled = computed(() => this.effect()?.enabled ?? false);
  readonly name = computed(() => this.effect()?.name ?? 'Volpan');
  readonly parameters = computed(() => this.effect()?.parameters ?? {});

  private readonly waveEditorService = inject(WaveEditorService);

  onApply() {
    this.waveEditorService.applyEffect();
  }

  onChange(effect: string) {
    this.waveEditorService.setFx(effect);
  }

  onToggle() {
    this.waveEditorService.setFxEnabled(!this.enabled());
  }

  onChangeParameters(parameters: Readonly<Record<string, string | boolean | number>>) {
    this.waveEditorService.setFxParams(this.name(), parameters);
  }
}
