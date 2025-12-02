import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WaveEditorState } from "../state/wave-editor.state";

export const waveEditorSelector = createFeatureSelector<WaveEditorState>('waveEditor');

export const waveEditorCurrentSelector = createSelector(
    waveEditorSelector,
    we => we.selected == undefined ? undefined : we.files[we.selected]
);

export const waveEditorCurrentFxSelector = createSelector(
    waveEditorCurrentSelector,
    we => we?.effect
);

export const waveEditorCurrentPitchSelector = createSelector(
    waveEditorCurrentSelector,
    we => we?.pitch
);

export const waveEditorSnapSelector = createSelector(
    waveEditorSelector,
    we => we.edit.snapToBars
);

export const waveEditorControlSelector = createSelector(
    waveEditorSelector,
    we => we.control
);

export const waveEditorEditSelector = createSelector(
    waveEditorSelector,
    we => we.edit
);

export const waveEditorModeSelector = createSelector(
    waveEditorSelector,
    we => we.edit.mode
);

export const waveEditorScrollSelector = createSelector(
    waveEditorCurrentSelector,
    we => we == undefined ? 1 : we.scrollOffset
);

export const waveEditorZoomSelector = createSelector(
    waveEditorCurrentSelector,
    we => we == undefined ? 0 : we.zoom
);