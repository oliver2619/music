import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, input, OnDestroy, signal, viewChild } from '@angular/core';

@Component({
  selector: 'm-uvmeter',
  imports: [],
  templateUrl: './uvmeter.component.html',
  styleUrl: './uvmeter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UvmeterComponent implements AfterViewInit, OnDestroy {

  readonly value = input.required<number>();

  private readonly container: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly resizeObserver = new ResizeObserver(() => this.onResize());
  private context: CanvasRenderingContext2D | null = null;
  private gradient: CanvasGradient | undefined;

  private maxValue = signal(0);

  constructor() {
    effect(() => {
      const clamped = Math.min(1, this.value());
      if (clamped > this.maxValue()) {
        this.maxValue.set(clamped);
      }
      this.paint();
    });
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.container.nativeElement);
    this.context = this.canvas().nativeElement.getContext('2d', { alpha: false });
    this.paint();
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  @HostListener('click')
  onClick() {
    this.maxValue.set(0);
  }

  private onResize() {
    this.canvas().nativeElement.width = this.container.nativeElement.clientWidth;
    this.canvas().nativeElement.height = this.container.nativeElement.clientHeight;
    this.gradient = undefined;
    this.paint();
  }

  private paint() {
    const v = this.value();
    const max = this.maxValue();
    if (this.context != null) {
      const w = this.context.canvas.width;
      const h = this.context.canvas.height;
      if (this.gradient == undefined) {
        this.gradient = this.context.createLinearGradient(0, 0, 0, h - 1);
        this.gradient.addColorStop(0, '#ff0000');
        this.gradient.addColorStop(0.1, '#ffff00');
        this.gradient.addColorStop(0.2, '#00ff00');
        this.gradient.addColorStop(0.25, '#00ffff');
        this.gradient.addColorStop(0.5, '#0080ff');
        this.gradient.addColorStop(1, '#004080');
      }
      this.context.clearRect(0, 0, w, h);
      this.context.fillStyle = this.gradient;
      let y = h - 1 - max * (h - 1);
      this.context.fillRect(0, y, w, 2);
      y = h - 1 - Math.max(0, Math.min(1, v)) * (h - 1);
      this.context.fillRect(0, y, w, h - y);
    }
  }
}
