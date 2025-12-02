import { WaveEditorConvertAction, WaveEditorNewAction } from "../action/wave-editor.action";
import { WaveEditorFileState, WaveEditorMode, WaveEditorPlaybackState, WaveEditorState } from "../state/wave-editor.state";

const DEFAULT_EFFECT = 'Volpan';

export class WaveEditorModel {

    private constructor(readonly state: WaveEditorState) { }

    static fromState(state: WaveEditorState): WaveEditorModel {
        return new WaveEditorModel(state);
    }

    static newInstance(): WaveEditorModel {
        return new WaveEditorModel({
            files: {},
            selected: undefined,
            control: {
                state: WaveEditorPlaybackState.PAUSE,
                isLooping: false,
            },
            edit: {
                snapToBars: undefined,
                mode: 'select',
                fxVisible: false,
                pitchVisible: false,
            }
        });
    }

    closeSelected(): WaveEditorModel {
        const selected = this.state.selected;
        const fileArray = Array.from(Object.entries(this.state.files)).filter(it => it[0] != selected)
        const files = Object.fromEntries(fileArray);
        return new WaveEditorModel({
            ...this.state,
            selected: fileArray.length === 0 ? undefined : fileArray[0][0],
            files,
            control: {
                ...this.state.control,
                state: WaveEditorPlaybackState.PAUSE,
            },
        });
    }

    convert(action: WaveEditorConvertAction): WaveEditorModel {
        const files = this.modifySelected(file => {
            return { ...file, sampleRate: action.samplerate, isStereo: action.stereo };
        });
        return new WaveEditorModel({
            ...this.state,
            files,
        });
    }

    new(action: WaveEditorNewAction): WaveEditorModel {
        const files: Record<string, WaveEditorFileState> = {
            ...this.state.files, [action.filename]: {
                canRedo: false,
                canUndo: false,
                isModified: false,
                isSaved: false,
                isStereo: action.stereo,
                name: action.filename,
                numberOfSamples: action.length,
                sampleRate: action.samplerate,
                scrollOffset: 0,
                selection: { start: 0, end: 0 },
                zoom: 1,
                effect: {
                    enabled: false,
                    name: DEFAULT_EFFECT,
                    parameters: {
                        volume: 1,
                        pan: 0,
                    },
                },
                pitch: {
                    pitch: 0,
                    snap: true,
                    speed: 0,
                }
            }
        };
        return new WaveEditorModel({
            ...this.state,
            selected: action.filename,
            files,
        })
    }

    play(): WaveEditorModel {
        return new WaveEditorModel({
            ...this.state,
            control: { ...this.state.control, state: WaveEditorPlaybackState.PLAYBACK },
        });
    }

    record(): WaveEditorModel {
        return new WaveEditorModel({
            ...this.state,
            control: { ...this.state.control, state: WaveEditorPlaybackState.RECORDING },
        });
    }

    saveSelected(): WaveEditorModel {
        const files = this.modifySelected(file => {
            return { ...file, isModified: false, isSaved: true };
        });
        return new WaveEditorModel({
            ...this.state,
            files,
        });
    }

    selectFile(selected: string): WaveEditorModel {
        return new WaveEditorModel({
            ...this.state,
            selected,
            control: {
                ...this.state.control,
                state: WaveEditorPlaybackState.PAUSE,
            },
        });
    }

    selectRange(start: number, end: number): WaveEditorModel {
        const files = this.modifySelected(file => {
            return { ...file, selection: { start, end } };
        });
        return new WaveEditorModel({
            ...this.state,
            files,
        });
    }

    setFx(fxName: string, parameters: Readonly<Record<string, number | boolean | string>>): WaveEditorModel {
        const files = this.modifySelected(file => {
            return { ...file, effect: { ...file.effect, name: fxName, parameters: { ...parameters } } };
        });
        return new WaveEditorModel({
            ...this.state,
            files,
        });
    }

    setFxEnabled(enabled: boolean): WaveEditorModel {
        const files = this.modifySelected(file => {
            return { ...file, effect: { ...file.effect, enabled } };
        });
        return new WaveEditorModel({
            ...this.state,
            files,
        });
    }

    setLoop(loop: boolean): WaveEditorModel {
        return new WaveEditorModel({
            ...this.state,
            control: { ...this.state.control, isLooping: loop },
        });
    }

    setMode(mode: WaveEditorMode): WaveEditorModel {
        return new WaveEditorModel({
            ...this.state,
            edit: {
                ...this.state.edit,
                mode,
            }
        });
    }

    setModified(isModified: boolean, canUndo: boolean, canRedo: boolean): WaveEditorModel {
        const files = this.modifySelected(file => {
            return { ...file, isModified, canUndo, canRedo };
        });
        return new WaveEditorModel({
            ...this.state,
            files,
        });
    }

    setPitch(pitch: number, speed: number): WaveEditorModel {
        const files = this.modifySelected(file => {
            return {
                ...file, pitch: { ...file.pitch, pitch, speed }
            };
        });
        return new WaveEditorModel({
            ...this.state,
            files,
        });
    }

    setScrollAndZoom(scrollOffset: number | undefined, zoom: number | undefined): WaveEditorModel {
        const files = this.modifySelected(file => {
            return {
                ...file, scrollOffset: scrollOffset ?? file.scrollOffset, zoom: zoom ?? file.zoom,
            };
        });
        return new WaveEditorModel({
            ...this.state,
            files,
        });
    }

    setSnapToBars(snapToBars: number | undefined): WaveEditorModel {
        return new WaveEditorModel({
            ...this.state,
            edit: {
                ...this.state.edit,
                snapToBars
            }
        });
    }

    setSnapPitch(snap: boolean): WaveEditorModel {
        const files = this.modifySelected(file => {
            return {
                ...file, pitch: { ...file.pitch, snap }
            };
        });
        return new WaveEditorModel({
            ...this.state,
            files,
        });
    }

    showFx(visible: boolean): WaveEditorModel {
        return new WaveEditorModel({
            ...this.state,
            edit: {
                ...this.state.edit,
                fxVisible: visible,
            }
        });
    }

    showPitch(visible: boolean): WaveEditorModel {
        return new WaveEditorModel({
            ...this.state,
            edit: {
                ...this.state.edit,
                pitchVisible: visible,
            }
        });
    }

    stop(): WaveEditorModel {
        return new WaveEditorModel({
            ...this.state,
            control: { ...this.state.control, state: WaveEditorPlaybackState.PAUSE },
        });
    }

    toState(): WaveEditorState {
        return this.state;
    }

    private modifySelected(fn: (file: WaveEditorFileState) => WaveEditorFileState): Record<string, WaveEditorFileState> {
        const selected = this.state.selected;
        return Object.fromEntries(Array.from(Object.entries(this.state.files)).map(it => {
            if (it[0] === selected) {
                return [it[0], fn(it[1])];
            } else {
                return it;
            }
        }));

    }
}