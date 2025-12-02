import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { ScrollbarComponent } from "../../../element/scrollbar/scrollbar.component";
import { Store } from '@ngrx/store';
import { waveEditorCurrentSelector, waveEditorModeSelector, waveEditorSnapSelector } from '../../../selector/wave-editor.selector';
import { waveEditorActions } from '../../../action/wave-editor.action';
import { mixBpmSelector } from '../../../selector/mix.selector';
import { convertUnitToNumSamples } from '../../../utils';

const separatorColor = '#ffffff';
const neutralLineColor = '#ffffff';
const selectionColor = '#808080';
const waveColor = '#ffffff';
const cursorColor = '#ffffff';

const ZOOM_INCREMENT = Math.sqrt(2);

@Component({
  selector: 'm-wave-editor-wave',
  imports: [ScrollbarComponent],
  templateUrl: './wave-editor-wave.component.html',
  styleUrl: './wave-editor-wave.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveEditorWaveComponent implements AfterViewInit {

  private readonly store = inject(Store);
  private readonly frame = viewChild.required<ElementRef<HTMLCanvasElement>>('frame');
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly resizeObserver = new ResizeObserver(() => {
    this.canvas().nativeElement.width = this.frame().nativeElement.clientWidth;
    this.canvas().nativeElement.height = this.frame().nativeElement.clientHeight;
    this.canvasWidth = this.canvas().nativeElement.width;
    this.canvasHeight = this.canvas().nativeElement.height;
    this.canvasHalfY = Math.floor(this.canvasHeight / 2);
    this.paint();
  });
  private context: CanvasRenderingContext2D | undefined;
  private canvasHalfY = 0;
  private canvasWidth = 0;
  private canvasHeight = 0;
  private readonly file = this.store.selectSignal(waveEditorCurrentSelector);
  private readonly zoom = computed(() => this.file()?.zoom ?? 1);
  private readonly snap = this.store.selectSignal(waveEditorSnapSelector);
  private readonly samplerate = computed(() => this.file()?.sampleRate ?? 0);
  private readonly bpm = this.store.selectSignal(mixBpmSelector);
  private readonly snapPos = computed(() => {
    return convertUnitToNumSamples(1, { unit: 'beats', samplerate: this.samplerate(), bpm: this.bpm() });
  });
  readonly scrollPos = computed(() => this.file()?.scrollOffset ?? 0);
  readonly totalScrollSize = computed(() => {
    const f = this.file();
    return f == undefined ? 0 : f.numberOfSamples * f.zoom;
  });
  private cursorStart = 0;
  private cursorDragged = 0;
  private cursorEnd = 0;
  private isMiddleButton = false;
  private mode = this.store.selectSignal(waveEditorModeSelector);

  constructor() {
    effect(() => {
      this.paint();
    });
  }

  ngAfterViewInit() {
    this.context = this.canvas().nativeElement.getContext('2d', { alpha: false }) ?? undefined;
    this.resizeObserver.observe(this.canvas().nativeElement);
  }

  onContextMenu(ev: Event) {
    ev.preventDefault();
  }

  onPointerDown(ev: PointerEvent) {
    if (ev.button === 0 || ev.button === 1) {
      this.canvas().nativeElement.requestPointerLock().then(() => {
        this.isMiddleButton = ev.button === 1;
        this.cursorStart = this.calculateSnapPos((ev.offsetX + this.scrollPos()) / this.zoom());
        this.cursorDragged = this.cursorStart;
        this.cursorEnd = this.cursorStart;
        this.paint();
      });
    }
  }

  onPointerUp(ev: PointerEvent) {
    if (ev.button === 0 || ev.button === 1) {
      if (document.pointerLockElement === this.canvas().nativeElement) {
        document.exitPointerLock();
        if (!this.isMiddleButton) {
          const left = Math.round(Math.min(this.cursorStart, this.cursorEnd));
          const right = Math.round(Math.max(this.cursorStart, this.cursorEnd));
          this.cursorStart = 0;
          this.cursorEnd = 0;
          switch (this.mode()) {
            case 'scroll':
              break;
            case 'select':
              this.store.dispatch(waveEditorActions.selectRange({ start: left, end: right }));
              break;
            case 'zoom':
              if (right > left) {
                const zoom = this.canvasWidth / (right - left);
                this.store.dispatch(waveEditorActions.setScrollAndZoom({ scrollOffset: left * zoom, zoom }));
              }
          }
        }
      }
    }
  }

  onPointerMove(ev: PointerEvent) {
    if (document.pointerLockElement === this.canvas().nativeElement) {
      let delta = ev.movementX;
      if (ev.ctrlKey) {
        delta *= 5;
      }
      if (ev.shiftKey) {
        delta *= 5;
      }
      if (this.mode() === 'scroll' || this.isMiddleButton) {
        this.store.dispatch(waveEditorActions.setScrollAndZoom({ scrollOffset: this.scrollPos() - delta }));
      } else {
        this.cursorDragged += delta / this.zoom();
        this.cursorEnd = this.calculateSnapPos(this.cursorDragged);
        this.paint();
      }
    }
  }

  onMouseWheel(ev: WheelEvent) {
    ev.preventDefault();
    if (ev.deltaY < 0) {
      this.zoomSetAt(ev.offsetX, this.snapZoomValue(this.zoom() * ZOOM_INCREMENT));
    } else if (ev.deltaY > 0) {
      this.zoomSetAt(ev.offsetX, this.snapZoomValue(this.zoom() / ZOOM_INCREMENT));
    }
  }

  onScroll(scroll: number) {
    this.store.dispatch(waveEditorActions.setScrollAndZoom({ scrollOffset: scroll }));
  }

  zoomIn() {
    this.zoomSetAt(undefined, this.snapZoomValue(this.zoom() / ZOOM_INCREMENT));
  }

  zoomOut() {
    this.zoomSetAt(undefined, this.snapZoomValue(this.zoom() * ZOOM_INCREMENT));
  }

  zoomSet(zoom: number) {
    this.zoomSetAt(undefined, zoom);
  }

  zoomShowAll() {
    const f = this.file();
    if (f == undefined || f.numberOfSamples === 0) {
      return;
    }
    this.store.dispatch(waveEditorActions.setScrollAndZoom({ scrollOffset: 0, zoom: this.canvasWidth / f.numberOfSamples }));
  }

  zoomShowSelection() {
    const f = this.file();
    if (f == undefined) {
      return;
    }
    const len = f.selection.end - f.selection.start;
    if (len <= 0) {
      return;
    }
    const zoom = this.canvasWidth / len;
    this.store.dispatch(waveEditorActions.setScrollAndZoom({ scrollOffset: f.selection.start * zoom, zoom }));
  }

  private calculateSnapPos(pos: number): number {
    const snap = this.snap();
    if (snap == undefined) {
      return pos;
    }
    const u = this.snapPos() * snap;
    if (u === 0) {
      return pos;
    }
    return Math.round(pos / u) * u;
  }

  private snapZoomValue(zoom: number): number {
    return Math.pow(2, (Math.round(Math.log2(zoom) * 2) / 2));
  }

  private paint() {
    const file = this.file();
    if (file == undefined || this.context == undefined) {
      return;
    }
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.save();
    this.context.translate(-this.scrollPos(), 0);
    this.context.scale(this.zoom(), 1);
    this.paintSelection();
    this.paintNeutralLines();
    this.paintWave();
    this.paintCursor();
    this.context.restore();
    this.paintSeparator();
  }

  private paintWave() {
    if (this.context == undefined || this.zoom() === 0) {
      return;
    }
    const s1 = Math.floor(this.scrollPos() / this.zoom());
    const s2 = Math.min(this.file()!.numberOfSamples, Math.ceil(s1 + this.canvasWidth / this.zoom()));
    this.context.save();
    this.context.strokeStyle = waveColor;
    this.context.lineWidth = 1;
    if (this.file()!.isStereo) {
      const neutralY1 = Math.floor(this.canvasHalfY / 2);
      const neutralY2 = Math.floor(this.canvasHalfY / 2) + this.canvasHalfY;
      const height = Math.floor(this.canvasHalfY / 2);
      this.context.beginPath();
      for (let s = s1; s <= s2; s = s + 2) {
        const y = neutralY1 - Math.sin(0.01 * s) * height;
        if (s === s1) {
          this.context.moveTo(s, y);
        } else {
          this.context.lineTo(s, y);
        }
      }
      this.context.stroke();
      this.context.beginPath();
      for (let s = s1; s <= s2; s = s + 2) {
        const y = neutralY2 - Math.cos(0.01 * s) * height;
        if (s === s1) {
          this.context.moveTo(s, y);
        } else {
          this.context.lineTo(s, y);
        }
      }
      this.context.stroke();
    } else {
      const height = Math.floor(this.canvasHalfY);
      this.context.beginPath();
      for (let s = s1; s <= s2; s = s + 2) {
        const y = this.canvasHalfY - Math.sin(0.01 * s) * height;
        if (s === s1) {
          this.context.moveTo(s, y);
        } else {
          this.context.lineTo(s, y);
        }
      }
      this.context.stroke();
    }
    this.context.restore();
  }

  private paintCursor() {
    if (this.context == undefined || this.cursorStart === this.cursorEnd) {
      return;
    }
    this.context.save();
    this.context.fillStyle = cursorColor;
    this.context.globalAlpha = 0.5;
    this.context.fillRect(Math.min(this.cursorStart, this.cursorEnd), 0, Math.abs(this.cursorEnd - this.cursorStart), this.canvasHeight);
    this.context.restore();
  }

  private paintSelection() {
    if (this.context == undefined) {
      return;
    }
    const sel = this.file()!.selection;
    this.context.save();
    if(sel.end > sel.start) {
      this.context.fillStyle = selectionColor;
      this.context.fillRect(sel.start, 0, sel.end - sel.start, this.canvasHeight);  
    }else {
      this.context.strokeStyle = selectionColor;
      this.context.beginPath();
      this.context.moveTo(sel.start, 0);
      this.context.lineTo(sel.start, this.canvasHeight);
      this.context.stroke();
    }
    this.context.restore();
  }

  private paintSeparator() {
    if (this.context == undefined || !this.file()!.isStereo) {
      return;
    }
    this.context.save();
    this.context.strokeStyle = separatorColor;
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.context.moveTo(0, this.canvasHalfY);
    this.context.lineTo(this.canvasWidth, this.canvasHalfY);
    this.context.stroke();
    this.context.restore();
  }

  private paintNeutralLines() {
    if (this.context == undefined) {
      return;
    }
    this.context.save();
    const stereo = this.file()!.isStereo;
    const end = this.file()!.numberOfSamples;
    if (stereo) {
      const neutralY1 = Math.floor(this.canvasHalfY / 2);
      const neutralY2 = Math.floor(this.canvasHalfY / 2) + this.canvasHalfY;
      this.context.strokeStyle = neutralLineColor;
      this.context.lineWidth = 1;
      this.context.beginPath();
      this.context.moveTo(0, neutralY1);
      this.context.lineTo(end, neutralY1);
      this.context.moveTo(0, neutralY2);
      this.context.lineTo(end, neutralY2);
      this.context.stroke();
    } else {
      this.context.strokeStyle = neutralLineColor;
      this.context.beginPath();
      this.context.moveTo(0, this.canvasHalfY);
      this.context.lineTo(end, this.canvasHalfY);
      this.context.stroke();
    }
    this.context.restore();
  }

  private zoomSetAt(screenPosition: number | undefined, zoom: number) {
    if (screenPosition == undefined) {
      screenPosition = this.canvas().nativeElement.clientWidth / 2;
    }
    this.store.dispatch(waveEditorActions.setScrollAndZoom({ zoom: zoom }));
  }

}
