import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentRef, input, output, signal, Type, viewChild, ViewContainerRef } from '@angular/core';
import { I18nDirective } from "@pluto-ngtools/i18n";
import { ModalComponentBase } from '../../service/modal.service';

@Component({
  selector: 'm-modal',
  imports: [I18nDirective],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements AfterViewInit {

  readonly title = input<string | undefined>();
  readonly component = input.required<Type<ModalComponentBase<any>>>();
  readonly close = output<any | undefined>();

  readonly content = viewChild.required('content', { read: ViewContainerRef });

  readonly valid = signal(true);

  private instance: ComponentRef<ModalComponentBase<any>> | undefined;

  ngAfterViewInit() {
    this.instance = this.content().createComponent(this.component());
    this.instance.instance.validChange.subscribe(valid => this.valid.set(valid));
  }

  onCancel() {
    this.close.emit(undefined);
  }

  onOk() {
    if (this.instance == undefined) {
      this.close.emit(undefined);
    } else {
      this.close.emit(this.instance.instance.getValue());
    }
  }
}
