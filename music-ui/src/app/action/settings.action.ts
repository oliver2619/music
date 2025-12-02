import { createActionGroup, props } from "@ngrx/store";
import { Unit } from "../model/unit";
import { SettingsAudioDeviceCapsState } from "../state/settings.state";

export interface SettingsUnitAction {
    readonly unit: Unit,
}

export interface SettingsNumberAction {
    readonly value: number;
}

export interface SettingsSetAudioDevicesAction {
    readonly players: Readonly<Record<string, SettingsAudioDeviceCapsState>>,
    readonly recorders: Readonly<Record<string, SettingsAudioDeviceCapsState>>,
}

export const settingsActions = createActionGroup({
    source: 'Settings',
    events: {
        setAudioDevices: props<SettingsSetAudioDevicesAction>(),
        setPlaybackVolume: props<SettingsNumberAction>(),
        setUnit: props<SettingsUnitAction>(),
    }
});