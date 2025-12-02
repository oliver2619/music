import { AfterViewInit, booleanAttribute, ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, input, numberAttribute, output, signal, viewChild } from '@angular/core';

type SliderOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'm-slider',
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'orientation()'
  },
})
export class SliderComponent implements AfterViewInit {

  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(1, { transform: numberAttribute });
  readonly neutral = input<number | undefined>(undefined);
  readonly step = input<number | undefined>(undefined);
  readonly db = input(false, { transform: booleanAttribute });
  readonly orientation = input.required<SliderOrientation>();
  readonly value = input(0, { transform: numberAttribute });

  readonly changing = output<number>();
  readonly changed = output<number>();

  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly slider = viewChild.required<ElementRef<HTMLDivElement>>('slider');
  private readonly modelValue = signal(0);
  private mouseDownModelValue = 0;
  private mouseCurrentPosition = 0;

  constructor() {
    effect(() => this.modelValue.set(this.inputValueToModelValue(this.value())));
    effect(() => this.updateSliderPosition());
  }

  ngAfterViewInit() {
    new ResizeObserver(() => this.updateSliderPosition()).observe(this.hostElement.nativeElement);
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(ev: Event) {
    ev.preventDefault();
    const p = this.neutral();
    if (p != undefined) {
      this.setValue(this.inputValueToModelValue(p), true);
    } else {
      this.setValue(this.min(), true);
    }
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(ev: PointerEvent) {
    if (ev.button === 0) {
      this.hostElement.nativeElement.requestPointerLock().then(() => {
        this.mouseDownModelValue = this.modelValue();
        this.mouseCurrentPosition = this.valueToPosition(this.modelValue());
      });
    }
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(ev: PointerEvent) {
    if (ev.button === 0) {
      if (document.pointerLockElement === this.hostElement.nativeElement) {
        document.exitPointerLock();
        if (this.mouseDownModelValue !== this.modelValue()) {
          this.changed.emit(this.modelValueToOutputValue(this.modelValue()));
        }
      }
    }
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(ev: PointerEvent) {
    if (document.pointerLockElement === this.hostElement.nativeElement) {
      const f = (ev.ctrlKey ? 0.2 : 1) * (ev.shiftKey ? 0.2 : 1);
      if (this.orientation() === 'horizontal') {
        const w = this.hostElement.nativeElement.clientWidth - this.slider().nativeElement.clientWidth;
        this.mouseCurrentPosition = Math.max(0, Math.min(w, this.mouseCurrentPosition + ev.movementX * f));
      } else {
        const h = this.hostElement.nativeElement.clientHeight - this.slider().nativeElement.clientHeight;
        this.mouseCurrentPosition = Math.max(0, Math.min(h, this.mouseCurrentPosition + ev.movementY * f));
      }
      this.setValue(this.positionToValue(this.mouseCurrentPosition), false);
    }
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(ev: WheelEvent) {
    ev.preventDefault();
    if (ev.deltaY != 0) {
      const s = this.step();
      if (s != undefined) {
        this.setValue(this.transformValueInRange(this.modelValue() - s * ev.deltaY / Math.abs(ev.deltaY)), true);
      }else {
        const f = (ev.ctrlKey ? 0.2 : 1) * (ev.shiftKey ? 0.2 : 1);
        this.setValue(this.transformValueInRange(this.modelValue() - (this.max() - this.min()) * 0.1 * f * ev.deltaY / Math.abs(ev.deltaY)), true);
      }
    }
  }

  private setValue(v: number, isChanged: boolean) {
    const newValue = this.transformValueInRange(v);
    if (newValue !== this.modelValue()) {
      this.modelValue.set(newValue);
      const outputValue = this.modelValueToOutputValue(newValue);
      this.changing.emit(outputValue);
      if (isChanged) {
        this.changed.emit(outputValue);
      }
    }
  }

  private inputValueToModelValue(inputValue: number): number {
    if (this.db()) {
      return this.transformValueInRange(Math.log10(inputValue) / 5 + 1);
    } else {
      return this.transformValueInRange(inputValue);
    }
  }

  private modelValueToOutputValue(modelValue: number): number {
    if (this.db()) {
      return Math.pow(10, (modelValue - 1) * 5);
    } else {
      return modelValue;
    }
  }

  private transformValueInRange(v: number): number {
    const step = this.step();
    if (step != undefined && step !== 0) {
      v = Math.round((v - this.min()) / step) * step + this.min();
    }
    return Math.max(this.min(), Math.min(this.max(), v));
  }

  private updateSliderPosition() {
    const s = this.slider().nativeElement;
    if (this.orientation() === 'horizontal') {
      s.style.left = `${this.valueToPosition(this.modelValue())}px`;
      s.style.top = '';
    } else {
      s.style.left = '';
      s.style.top = `${this.valueToPosition(this.modelValue())}px`;
    }
  }

  private valueToPosition(value: number): number {
    const s = this.slider().nativeElement;
    const min = this.min();
    const max = this.max();
    const offset = max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)));
    if (this.orientation() === 'horizontal') {
      const w = this.hostElement.nativeElement.clientWidth - s.clientWidth;
      return offset * w;
    } else {
      const h = this.hostElement.nativeElement.clientHeight - s.clientHeight;
      return (1 - offset) * h;
    }
  }

  private positionToValue(pos: number): number {
    const s = this.slider().nativeElement;
    const min = this.min();
    const max = this.max();
    if (this.orientation() === 'horizontal') {
      const w = this.hostElement.nativeElement.clientWidth - s.clientWidth;
      return (pos / w) * (max - min) + min;
    } else {
      const h = this.hostElement.nativeElement.clientHeight - s.clientHeight;
      return (1 - pos / h) * (max - min) + min;
    }
  }
}
