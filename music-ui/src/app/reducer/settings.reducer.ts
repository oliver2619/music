import { createReducer, on } from "@ngrx/store";
import { SettingsState } from "../state/settings.state";
import { settingsActions, SettingsNumberAction, SettingsSetAudioDevicesAction, SettingsUnitAction } from "../action/settings.action";

const initialState: SettingsState = {
    global: {
        unit: 'samples',
    },
    players: {
        player1: {
            name: 'Player 1',
            maxSamplerate: 44100,
        },
    },
    recorders: {
        recorder1: {
            name: 'Recorder 1',
            maxSamplerate: 44100,
        },
    },
    player: undefined,
    recorder: undefined,
};

function onSetAudioDevices(state: SettingsState, action: SettingsSetAudioDevicesAction): SettingsState {
    const playerList = Object.entries(action.players);
    const recorderList = Object.entries(action.recorders);
    return {
        ...state,
        player: state.player == undefined && playerList.length > 0 ? {id: playerList[0][0], latency: 0, samplerate: playerList[0][1].maxSamplerate, volume: 1} : state.player,
        players: { ...action.players },
        recorder: state.recorder == undefined && recorderList.length > 0 ? {id: recorderList[0][0], latency: 0, samplerate: recorderList[0][1].maxSamplerate, volume: 1} : state.recorder,
        recorders: { ...action.recorders },
    }
}

function onSetPlaybackVolume(state: SettingsState, action: SettingsNumberAction): SettingsState {
    if (state.player == undefined) {
        return state;
    }
    return { ...state, player: { ...state.player, volume: action.value } };
}

function onSetUnit(state: SettingsState, action: SettingsUnitAction): SettingsState {
    return { ...state, global: { ...state.global, unit: action.unit } };
}

export const settingsReducer = createReducer(
    initialState,
    on(settingsActions.setAudioDevices, onSetAudioDevices),
    on(settingsActions.setPlaybackVolume, onSetPlaybackVolume),
    on(settingsActions.setUnit, onSetUnit),
);