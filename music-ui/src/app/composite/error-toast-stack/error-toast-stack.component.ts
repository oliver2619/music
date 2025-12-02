import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { errorsSelector } from '../../selector/error.selector';
import { ErrorToastComponent } from '../../element/error-toast/error-toast.component';

@Component({
  selector: 'm-error-toast-stack',
  imports: [ErrorToastComponent],
  templateUrl: './error-toast-stack.component.html',
  styleUrl: './error-toast-stack.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorToastStackComponent {

  private readonly store = inject(Store);

  readonly errors = this.store.selectSignal(errorsSelector);
}
