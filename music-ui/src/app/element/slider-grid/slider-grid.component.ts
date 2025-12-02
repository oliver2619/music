import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, input, output, signal, viewChild } from '@angular/core';

const AXIS_COLOR = '#a0d0ff';
const VALUE_COLOR = '#ffffff';

export interface SliderGridChangeEvent {
  readonly x: number;
  readonly y: number;
}

@Component({
  selector: 'm-slider-grid',
  imports: [],
  templateUrl: './slider-grid.component.html',
  styleUrl: './slider-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderGridComponent implements AfterViewInit {

  readonly x = input.required<number>();
  readonly y = input.required<number>();
  readonly snap = input.required<boolean>();

  readonly changing = output<SliderGridChangeEvent>();

  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly resizeObserver = new ResizeObserver(() => this.onResize());
  private renderingContext: CanvasRenderingContext2D | undefined;
  private readonly width = signal(0);
  private readonly height = signal(0);
  private modelX = signal(0);
  private modelY = signal(0);
  private mousePosition: { x: number, y: number } = { x: 0, y: 0 };

  constructor() {
    effect(() => {
      this.repaint();
    });
    effect(() => {
      this.modelX.set(this.x());
      this.modelY.set(this.y());
    });
  }

  ngAfterViewInit() {
    this.renderingContext = this.canvas().nativeElement.getContext('2d', { alpha: false }) ?? undefined;
    this.resizeObserver.observe(this.hostElement.nativeElement);
    this.repaint();
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(ev: Event) {
    ev.preventDefault();
    this.setValue(0, 0);
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(ev: PointerEvent) {
    if (ev.button === 0) {
      this.hostElement.nativeElement.requestPointerLock().then(() => {
        this.mousePosition = this.valueToPosition(this.modelX(), this.modelY());
      });
    }
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(ev: PointerEvent) {
    if (ev.button === 0) {
      if (document.pointerLockElement === this.hostElement.nativeElement) {
        document.exitPointerLock();
      }
    }
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(ev: PointerEvent) {
    if (document.pointerLockElement === this.hostElement.nativeElement) {
      const f = (ev.ctrlKey ? 0.2 : 1) * (ev.shiftKey ? 0.2 : 1);
      const canvas = this.canvas().nativeElement;
      this.mousePosition.x = Math.max(0, Math.min(canvas.clientWidth - 1, this.mousePosition.x + ev.movementX * f));
      this.mousePosition.y = Math.max(0, Math.min(canvas.clientHeight - 1, this.mousePosition.y - ev.movementY * f));
      const v = this.positionToValue(this.mousePosition.x, this.mousePosition.y);
      this.setValue(v.x, v.y);
    }
  }

  private setValue(x: number, y: number) {
    const nx = Math.max(-1, Math.min(1, x));
    const ny = Math.max(-1, Math.min(1, y));
    if (this.modelX() !== nx || this.modelY() !== ny) {
      this.modelX.set(nx);
      this.modelY.set(ny);
      this.changing.emit({ x: nx, y: ny });
    }
  }

  private onResize() {
    const host: HTMLElement = this.hostElement.nativeElement;
    const canvas = this.canvas().nativeElement;
    if (host.clientWidth > 0 && host.clientHeight > 0) {
      canvas.width = host.clientWidth;
      canvas.height = host.clientHeight;
      this.width.set(canvas.width);
      this.height.set(canvas.height);
    }
  }

  private positionToValue(x: number, y: number): { x: number, y: number } {
    const canvas = this.canvas().nativeElement;
    const w = canvas.clientWidth - 1;
    const h = canvas.clientHeight - 1;
    return { x: this.snapValue((x / w) * 2 - 1), y: this.snapValue((y / h) * 2 - 1) };
  }

  private snapValue(v: number): number {
    return this.snap() ? Math.round((v + 1) * 12) / 12 - 1 : v;
  }

  private valueToPosition(x: number, y: number): { x: number, y: number } {
    const canvas = this.canvas().nativeElement;
    const w = canvas.clientWidth - 1;
    const h = canvas.clientHeight - 1;
    return { x: (x + 1) * w / 2, y: (y + 1) * h / 2 };
  }

  private repaint() {
    const width = this.width() - 1;
    const height = this.height() - 1;
    const x = (this.modelX() + 1) * width / 2;
    const y = (1 - this.modelY()) * height / 2;
    if (this.renderingContext != undefined) {
      this.renderingContext.clearRect(0, 0, width, height);
      this.renderingContext.save();
      try {
        // grid
        this.renderingContext.lineWidth = 1;
        this.renderingContext.strokeStyle = AXIS_COLOR;
        for (let i = 0; i <= 24; ++i) {
          const lx = i * width / 24;
          const ly = i * height / 24;
          switch (Math.abs(i - 12)) {
            case 0:
            case 12:
              this.renderingContext.globalAlpha = 1;
              break;
            case 2:
            case 4:
            case 5:
            case 7:
            case 9:
            case 11:
              this.renderingContext.globalAlpha = 0.5;
              break;
            default:
              this.renderingContext.globalAlpha = 0.25;
          }
          this.renderingContext.beginPath();
          this.renderingContext.moveTo(0, ly);
          this.renderingContext.lineTo(width, ly);
          this.renderingContext.moveTo(lx, 0);
          this.renderingContext.lineTo(lx, height);
          this.renderingContext.stroke();
        }
        this.renderingContext.globalAlpha = 1;
        this.renderingContext.beginPath();
        const cx = this.width() / 2;
        this.renderingContext.moveTo(cx, 0);
        this.renderingContext.lineTo(cx, height);
        this.renderingContext.stroke();

        // value
        this.renderingContext.lineWidth = 2;
        this.renderingContext.strokeStyle = VALUE_COLOR;
        this.renderingContext.beginPath();
        this.renderingContext.moveTo(0, y);
        this.renderingContext.lineTo(width, y);
        this.renderingContext.moveTo(x, 0);
        this.renderingContext.lineTo(x, height);
        this.renderingContext.stroke();

      } finally {
        this.renderingContext.restore();
      }
    }
  }
}
