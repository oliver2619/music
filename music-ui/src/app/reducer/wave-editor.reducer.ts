import { createReducer, on } from "@ngrx/store";
import { WaveEditorState } from "../state/wave-editor.state";
import { waveEditorActions, WaveEditorConvertAction, WaveEditorEnabledAction, WaveEditorFileAction, WaveEditorFxAction, WaveEditorModeAction, WaveEditorModifiedAction, WaveEditorNewAction, WaveEditorPitchAction, WaveEditorSelectRangeAction, WaveEditorSnapAction, WaveEditorScrollAndZoomAction } from "../action/wave-editor.action";
import { WaveEditorModel } from "../model/wave-editor.model";

const initialState: WaveEditorState = WaveEditorModel.newInstance()
    .new({ filename: 'new', length: 44100, samplerate: 44100, stereo: true })
    .toState();

function onCloseSelected(state: WaveEditorState): WaveEditorState {
    return WaveEditorModel.fromState(state).closeSelected().toState();
}

function onConvert(state: WaveEditorState, action: WaveEditorConvertAction): WaveEditorState {
    return WaveEditorModel.fromState(state).convert(action).toState();
}

function onNew(state: WaveEditorState, action: WaveEditorNewAction): WaveEditorState {
    return WaveEditorModel.fromState(state).new(action).toState();
}

function onPlay(state: WaveEditorState): WaveEditorState {
    return WaveEditorModel.fromState(state).play().toState();
}

function onRecord(state: WaveEditorState): WaveEditorState {
    return WaveEditorModel.fromState(state).record().toState();
}

function onSaveSelected(state: WaveEditorState): WaveEditorState {
    return WaveEditorModel.fromState(state).saveSelected().toState();
}

function onSelectFile(state: WaveEditorState, action: WaveEditorFileAction): WaveEditorState {
    return WaveEditorModel.fromState(state).selectFile(action.filename).toState();
}

function onSelectRange(state: WaveEditorState, action: WaveEditorSelectRangeAction): WaveEditorState {
    return WaveEditorModel.fromState(state).selectRange(action.start, action.end).toState();
}

function onSetFx(state: WaveEditorState, action: WaveEditorFxAction): WaveEditorState {
    return WaveEditorModel.fromState(state).setFx(action.fxName, action.parameters).toState();
}

function onSetFxEnabled(state: WaveEditorState, action: WaveEditorEnabledAction): WaveEditorState {
    return WaveEditorModel.fromState(state).setFxEnabled(action.enabled).toState();
}

function onSetLoop(state: WaveEditorState, action: WaveEditorEnabledAction): WaveEditorState {
    return WaveEditorModel.fromState(state).setLoop(action.enabled).toState();
}

function onSetMode(state: WaveEditorState, action: WaveEditorModeAction): WaveEditorState {
    return WaveEditorModel.fromState(state).setMode(action.mode).toState();
}

function onSetModified(state: WaveEditorState, action: WaveEditorModifiedAction): WaveEditorState {
    return WaveEditorModel.fromState(state).setModified(action.isModified, action.canUndo, action.canRedo).toState();
}

function onSetPitch(state: WaveEditorState, action: WaveEditorPitchAction): WaveEditorState {
    return WaveEditorModel.fromState(state).setPitch(action.pitch, action.speed).toState();
}

function onSetScrollAndZoom(state: WaveEditorState, action: WaveEditorScrollAndZoomAction): WaveEditorState {
    return WaveEditorModel.fromState(state).setScrollAndZoom(action.scrollOffset, action.zoom).toState();
}

function onSetSnap(state: WaveEditorState, action: WaveEditorSnapAction): WaveEditorState {
    return WaveEditorModel.fromState(state).setSnapToBars(action.bars).toState();
}

function onSetSnapPitch(state: WaveEditorState, action: WaveEditorEnabledAction): WaveEditorState {
    return WaveEditorModel.fromState(state).setSnapPitch(action.enabled).toState();
}

function onShowFx(state: WaveEditorState, action: WaveEditorEnabledAction): WaveEditorState {
    return WaveEditorModel.fromState(state).showFx(action.enabled).toState();
}

function onShowPitch(state: WaveEditorState, action: WaveEditorEnabledAction): WaveEditorState {
    return WaveEditorModel.fromState(state).showPitch(action.enabled).toState();
}

function onStop(state: WaveEditorState): WaveEditorState {
    return WaveEditorModel.fromState(state).stop().toState();
}

export const waveEditorReducer = createReducer(initialState,
    on(waveEditorActions.closeSelected, onCloseSelected),
    on(waveEditorActions.convert, onConvert),
    on(waveEditorActions.new, onNew),
    on(waveEditorActions.play, onPlay),
    on(waveEditorActions.record, onRecord),
    on(waveEditorActions.saveSelected, onSaveSelected),
    on(waveEditorActions.selectFile, onSelectFile),
    on(waveEditorActions.selectRange, onSelectRange),
    on(waveEditorActions.setFx, onSetFx),
    on(waveEditorActions.setFxEnabled, onSetFxEnabled),
    on(waveEditorActions.setLoop, onSetLoop),
    on(waveEditorActions.setMode, onSetMode),
    on(waveEditorActions.setModified, onSetModified),
    on(waveEditorActions.setPitch, onSetPitch),
    on(waveEditorActions.setScrollAndZoom, onSetScrollAndZoom),
    on(waveEditorActions.setSnap, onSetSnap),
    on(waveEditorActions.setSnapPitch, onSetSnapPitch),
    on(waveEditorActions.showFx, onShowFx),
    on(waveEditorActions.showPitch, onShowPitch),
    on(waveEditorActions.stop, onStop),
);