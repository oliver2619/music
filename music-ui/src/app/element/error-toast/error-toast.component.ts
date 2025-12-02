import { ChangeDetectionStrategy, Component, HostListener, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { errorActions } from '../../action/error.action';

const ERROR_TIMEOUT_MS = 60_000;

@Component({
  selector: 'm-error-toast',
  imports: [],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorToastComponent {

  private readonly store = inject(Store);

  readonly messageId = input.required<number>();
  readonly message = input.required<string>();

  private timer: number | undefined = window.setTimeout(() => {
    this.hide();
    this.timer = undefined;
  }, ERROR_TIMEOUT_MS);

  @HostListener('click')
  onClick() {
    if (this.timer != undefined) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.hide();
  }

  private hide() {
    this.store.dispatch(errorActions.remove({ id: this.messageId() }));
  }
}
