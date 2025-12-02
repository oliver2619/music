import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SettingsState } from "../state/settings.state";

const settingsSelector = createFeatureSelector<SettingsState>('settings');

export const settingsUnitSelector = createSelector(
    settingsSelector,
    s => s.global.unit
);

export const settingsPlayersSelector = createSelector(
    settingsSelector,
    s => s.players
);

export const settingsPlayerVolumeSelector = createSelector(
    settingsSelector,
    s => s.player?.volume ?? 0
);

export const settingsRecordersSelector = createSelector(
    settingsSelector,
    s => s.recorders
);
