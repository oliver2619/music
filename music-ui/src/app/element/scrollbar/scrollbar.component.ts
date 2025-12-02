import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, input, numberAttribute, OnDestroy, output, signal, untracked, viewChild } from '@angular/core';

type ScrollbarOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'm-scrollbar',
  imports: [],
  templateUrl: './scrollbar.component.html',
  styleUrl: './scrollbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'orientation()'
  },
})
export class ScrollbarComponent implements AfterViewInit, OnDestroy {

  readonly pos = input.required({ transform: numberAttribute });
  readonly total = input.required({ transform: numberAttribute });
  readonly orientation = input.required<ScrollbarOrientation>();
  readonly target = input.required<HTMLElement>();

  readonly scroll = output<number>();

  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly scrollbar = viewChild.required<ElementRef<HTMLElement>>('scrollbar');
  private _pos = signal(0);
  private _page = signal(0);
  private _total = signal(0);
  private readonly targetObserver = new ResizeObserver(() => {
    this.setTotalAndPageSize();
  });
  private mouseDownMousePosition = 0;
  private mouseDownposition = 0;

  constructor() {
    effect(() => this.setTotalAndPageSize());
    effect(() => this.updateScrollbar());
    effect(() => {
      this.targetObserver.disconnect();
      this.targetObserver.observe(this.target());
    });
  }

  ngAfterViewInit() {
    new ResizeObserver(() => this.updateScrollbar()).observe(this.hostElement.nativeElement);
  }

  ngOnDestroy() {
    this.targetObserver.disconnect();
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(ev: PointerEvent) {
    if (ev.button === 0) {
      this.hostElement.nativeElement.setPointerCapture(ev.pointerId);
      this.mouseDownposition = this._pos();
      if (this.orientation() === 'horizontal') {
        this.mouseDownMousePosition = ev.screenX;
      } else {
        this.mouseDownMousePosition = ev.screenY;
      }
  }
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(ev: PointerEvent) {
    if (ev.button === 0 && this.hostElement.nativeElement.hasPointerCapture(ev.pointerId)) {
      this.hostElement.nativeElement.releasePointerCapture(ev.pointerId);
    }
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(ev: PointerEvent) {
    if (this.hostElement.nativeElement.hasPointerCapture(ev.pointerId)) {
      const sbLength = this.getScrollbarLength();
      if (sbLength > 0) {
        if (this.orientation() === 'horizontal') {
          this.setPosition(this.mouseDownposition + (ev.screenX - this.mouseDownMousePosition) * this._total() / sbLength);
        } else {
          this.setPosition(this.mouseDownposition + (ev.screenY - this.mouseDownMousePosition) * this._total() / sbLength);
        }
      }
    }
  }

  private setTotalAndPageSize() {
    const total = Math.max(0, this.total());
    this._total.set(total);
    const page = Math.min(this.getTargetLength(), total);
    this._page.set(page);
    const pos = Math.max(0, Math.min(total - page, this.pos()));
    this._pos.set(pos);
    this.scroll.emit(pos);
  }

  private setPosition(pos: number) {
    this.scroll.emit(Math.max(0, Math.min(this._total() - this._page(), pos)));
  }

  private updateScrollbar() {
    const scrollbar = this.scrollbar().nativeElement;
    const sbLength = this.getScrollbarLength();
    const sbPos = this._total() === 0 ? 0 : this._pos() * sbLength / this._total();
    const sbSize = Math.max(1, this._total() === 0 ? sbLength : this._page() * sbLength / this._total());
    if (this.orientation() === 'horizontal') {
      scrollbar.style.left = `${sbPos}px`;
      scrollbar.style.width = `${sbSize}px`;
      scrollbar.style.top = '';
      scrollbar.style.height = '';
    } else {
      scrollbar.style.left = '';
      scrollbar.style.width = '';
      scrollbar.style.top = `${sbPos}px`;
      scrollbar.style.height = `${sbSize}px`;
    }
  }

  private getScrollbarLength(): number {
    if (this.orientation() === 'horizontal') {
      return this.hostElement.nativeElement.clientWidth;
    } else {
      return this.hostElement.nativeElement.clientHeight;
    }
  }

  private getTargetLength(): number {
    if (this.orientation() === 'horizontal') {
      return this.target().clientWidth;
    } else {
      return this.target().clientHeight;
    }
  }
}
