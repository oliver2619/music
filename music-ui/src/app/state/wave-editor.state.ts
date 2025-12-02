export type WaveEditorMode = 'select' | 'scroll' | 'zoom';

export enum WaveEditorPlaybackState {
    PAUSE, PLAYBACK, RECORDING
}

export interface WaveEditorFxState {
    readonly enabled: boolean;
    readonly name: string;
    readonly parameters: Readonly<Record<string, number | string | boolean>>;
}

export interface WaveEditorPitchState {
    readonly pitch: number;
    readonly speed: number;
    readonly snap: boolean;
}

export interface WaveEditorFileState {
    readonly name: string;
    readonly isModified: boolean;
    readonly isSaved: boolean;
    readonly selection: { readonly start: number, readonly end: number };
    readonly zoom: number;
    readonly scrollOffset: number;
    readonly isStereo: boolean;
    readonly sampleRate: number;
    readonly numberOfSamples: number;
    readonly canUndo: boolean;
    readonly canRedo: boolean;
    readonly effect: WaveEditorFxState;
    readonly pitch: WaveEditorPitchState;
}

export interface WaveEditorControlState {
    readonly state: WaveEditorPlaybackState;
    readonly isLooping: boolean;
}

export interface WaveEditorEditState {
    readonly mode: WaveEditorMode;
    readonly snapToBars: number | undefined;
    readonly pitchVisible: boolean;
    readonly fxVisible: boolean;
}

export interface WaveEditorState {
    readonly selected: string | undefined;
    readonly files: Readonly<Record<string, WaveEditorFileState>>;
    readonly control: WaveEditorControlState;
    readonly edit: WaveEditorEditState;
}