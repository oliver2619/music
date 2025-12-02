import { Unit } from "../model/unit";

export interface SettingsGlobalState {
    readonly unit: Unit;
}

export interface SettingsAudioDeviceCapsState {
    readonly name: string;
    readonly maxSamplerate: number;
}

export interface SettingsAudioDeviceState {
    readonly id: string;
    readonly volume: number;
    readonly samplerate: number;
    readonly latency: number;
}

export interface SettingsState {
    readonly global: SettingsGlobalState;
    readonly players: Readonly<Record<string, SettingsAudioDeviceCapsState>>;
    readonly recorders: Readonly<Record<string, SettingsAudioDeviceCapsState>>;
    readonly player: SettingsAudioDeviceState | undefined;
    readonly recorder: SettingsAudioDeviceState | undefined;
}