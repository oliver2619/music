import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { WaveEditorMode } from "../state/wave-editor.state";

export interface WaveEditorConvertAction {
    readonly stereo: boolean;
    readonly samplerate: number;
}

export interface WaveEditorFileAction {
    readonly filename: string;
}

export interface WaveEditorModifiedAction {
    readonly isModified: boolean;
    readonly canUndo: boolean;
    readonly canRedo: boolean;
}

export interface WaveEditorNewAction {
    readonly filename: string;
    readonly stereo: boolean;
    readonly samplerate: number;
    readonly length: number;
}

export interface WaveEditorSelectRangeAction {
    readonly start: number;
    readonly end: number;
}

export interface WaveEditorSnapAction {
    readonly bars: number | undefined;
}

export interface WaveEditorEnabledAction {
    readonly enabled: boolean;
}

export interface WaveEditorFxAction {
    readonly fxName: string;
    readonly parameters: Readonly<Record<string, number | boolean | string>>;
}

export interface WaveEditorPitchAction {
    readonly pitch: number;
    readonly speed: number;
}

export interface WaveEditorModeAction {
    readonly mode: WaveEditorMode;
}

export interface WaveEditorScrollAndZoomAction {
    readonly scrollOffset?: number;
    readonly zoom?: number;
}

export const waveEditorActions = createActionGroup({
    source: 'WaveEditor',
    events: {
        closeSelected: emptyProps(),
        convert: props<WaveEditorConvertAction>(),
        new: props<WaveEditorNewAction>(),
        play: emptyProps(),
        record: emptyProps(),
        saveSelected: emptyProps(),
        selectFile: props<WaveEditorFileAction>(),
        selectRange: props<WaveEditorSelectRangeAction>(),
        setFx: props<WaveEditorFxAction>(),
        setFxEnabled: props<WaveEditorEnabledAction>(),
        setLoop: props<WaveEditorEnabledAction>(),
        setMode: props<WaveEditorModeAction>(),
        setModified: props<WaveEditorModifiedAction>(),
        setPitch: props<WaveEditorPitchAction>(),
        setScrollAndZoom: props<WaveEditorScrollAndZoomAction>(),
        setSnap: props<WaveEditorSnapAction>(),
        setSnapPitch: props<WaveEditorEnabledAction>(),
        showFx: props<WaveEditorEnabledAction>(),
        showPitch: props<WaveEditorEnabledAction>(),
        stop: emptyProps(),
    }
});