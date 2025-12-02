import { AfterViewInit, Component, HostListener, inject, isDevMode, OnDestroy, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from '@pluto-ngtools/i18n';
import { MainNavbarComponent } from "./composite/main-navbar/main-navbar.component";
import { ModalService } from './service/modal.service';
import { ErrorToastStackComponent } from "./composite/error-toast-stack/error-toast-stack.component";

@Component({
  selector: 'm-root',
  imports: [RouterOutlet, MainNavbarComponent, ErrorToastStackComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App implements AfterViewInit, OnDestroy {

  readonly viewContainerRef = inject(ViewContainerRef);
  readonly modalService = inject(ModalService);

  constructor() {
    document.title = inject(I18nService).get('title');
    document.addEventListener('wheel', ev => {
      if (!isDevMode()) {
        ev.preventDefault();
      }
    }, { passive: false })
  }

  ngAfterViewInit() {
    this.modalService.registerViewContainerRef(this.viewContainerRef);
  }

  ngOnDestroy() {
    // TODO unregister viewContainerRef?
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(ev: Event) {
    if (!isDevMode()) {
      ev.preventDefault();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (!isDevMode()) {
      switch (ev.key) {
        default:
          if (/F[0-9]+/.test(ev.key)) {
            ev.preventDefault();
          } else {
            // console.log(ev.key);
          }
      }
    }
  }
}
