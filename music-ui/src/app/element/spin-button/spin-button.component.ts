import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, input, output, signal, viewChild } from '@angular/core';

const VIRTUAL_SIZE = window.screen.height;

@Component({
  selector: 'm-spin-button',
  imports: [],
  templateUrl: './spin-button.component.html',
  styleUrl: './spin-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinButtonComponent implements AfterViewInit {

  readonly value = input.required<number>();
  readonly min = input.required<number>();
  readonly max = input.required<number>();
  readonly neutral = input.required<number>();

  readonly step = input<number | undefined>(undefined);
  readonly db = input<boolean>(false);
  readonly changing = output<number>();
  readonly changed = output<number>();

  private readonly model = signal(0);
  private mouseDownModelValue = 0;
  private position = 0;

  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly svg = viewChild.required<ElementRef<SVGPathElement>>('svg')

  constructor() {
    effect(() => this.model.set(this.inputValueToModelValue(this.value())));
    effect(() => this.updateSvg());
  }

  ngAfterViewInit(): void {
    this.updateSvg();
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(ev: Event) {
    ev.preventDefault();
    const p = this.neutral();
    if (p != undefined) {
      this.setValue(p);
    } else {
      this.setValue(this.min());
    }
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(ev: PointerEvent) {
    if (ev.button === 0) {
      this.hostElement.nativeElement.requestPointerLock().then(() => {
        this.mouseDownModelValue = this.model();
        this.position = this.valueToPosition(this.mouseDownModelValue);
      });
    }
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(ev: PointerEvent) {
    if (ev.button === 0) {
      if (document.pointerLockElement === this.hostElement.nativeElement) {
        document.exitPointerLock();
        if (this.mouseDownModelValue !== this.model()) {
          this.changed.emit(this.modelValueToOutputValue(this.model()));
        }
      }
    }
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(ev: PointerEvent) {
    if (document.pointerLockElement === this.hostElement.nativeElement) {
      const f = (ev.ctrlKey ? 0.2 : 1) * (ev.shiftKey ? 0.2 : 1);
      this.position = Math.max(0, Math.min(VIRTUAL_SIZE, this.position - ev.movementY * f));
      this.setValue(this.transformValueInRange(this.positionToValue(this.position)));
    }
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(ev: WheelEvent) {
    ev.preventDefault();
    if (ev.deltaY != 0) {
      const s = this.step();
      if (s != undefined) {
        this.setValue(this.transformValueInRange(this.model() - s * ev.deltaY / Math.abs(ev.deltaY)));
      } else {
        const f = (ev.ctrlKey ? 0.2 : 1) * (ev.shiftKey ? 0.2 : 1);
        this.setValue(this.transformValueInRange(this.model() - (this.max() - this.min()) * 0.1 * f * ev.deltaY / Math.abs(ev.deltaY)));
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

  private setValue(v: number) {
    if (v !== this.model()) {
      this.model.set(v);
      this.changing.emit(this.modelValueToOutputValue(v));
    }
  }

  private transformValueInRange(v: number): number {
    const step = this.step();
    if (step != undefined && step !== 0) {
      v = Math.round((v - this.min()) / step) * step + this.min();
    }
    return Math.max(this.min(), Math.min(this.max(), v));
  }

  private updateSvg() {
    const path = this.svg().nativeElement;
    const transform = path.transform.baseVal;
    const rot = (this.model() - this.min()) * 270 / (this.max() - this.min());
    if (transform.length === 0) {
      const r = path.ownerSVGElement!.createSVGTransform();
      r.setRotate(rot, 16, 16);
      transform.appendItem(r);
    } else {
      transform[0].setRotate(rot, 16, 16)
    }
  }

  private valueToPosition(value: number): number {
    const min = this.min();
    const max = this.max();
    const offset = max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)));
    return offset * VIRTUAL_SIZE;
  }

  private positionToValue(pos: number): number {
    const min = this.min();
    const max = this.max();
    return (pos / VIRTUAL_SIZE) * (max - min) + min;
  }

}
