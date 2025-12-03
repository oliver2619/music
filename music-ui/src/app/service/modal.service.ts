import { Injectable, Signal, Type, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../composite/modal/modal.component';

export enum DialogButtons {
  OK,
  OK_CANCEL,
  YES_NO,
  YES_NO_CANCEL
}

export enum ModalResult {
  YES = 0, NO = 1, CANCEL = 2
}

export interface ModalComponentBase<T> {
  readonly valid: Signal<boolean>;
  getValue(): T;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  private viewContainerRef: ViewContainerRef | undefined;

  registerViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  showDialog<T, C extends ModalComponentBase<T>>(type: Type<C>, title: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (this.viewContainerRef == undefined) {
        reject(new Error('No viewContainerRef registered.'));
        return;
      }
      const componentRef = this.viewContainerRef.createComponent(ModalComponent);
      componentRef.setInput('title', title);
      componentRef.setInput('component', type);
      componentRef.instance.close.subscribe(result => {
        componentRef.destroy();
        resolve(result);
      });
    });
  }
}
