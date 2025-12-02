import { createReducer, on } from "@ngrx/store";
import { MixState } from "../state/mix.state";
import { mixActions, MixAddTrackAction, MixSetAudioTrackRouteAction, MixSetTrackEqAction, MixSetTrackFxAction, MixSetTrackNameAction, MixSetTrackSendFxAction, MixSetTrackVolpanAction, MixSetVisibilityAction, MixTrackAction, MixTrackBooleanAction } from "../action/mix.action";
import { Mix } from "../model/mix";

const initialState: MixState = Mix.newInstance({ bpm: 140, name: 'New song', samplerate: 44100 }).toState();

function onAddTrack(state: MixState, action: MixAddTrackAction): MixState {
    return Mix.fromState(state).addTrack(action.trackType).toState();
}

function onRemoveTrack(state: MixState, action: MixTrackAction): MixState {
    return Mix.fromState(state).removeTrack(action.trackId).toState();
}

function onSetAudioTrackRoute(state: MixState, action: MixSetAudioTrackRouteAction): MixState {
    return Mix.fromState(state).setAudioTrackRoute(action.trackId, action.targetTrackId).toState();
}

function onSetTrackEq(state: MixState, action: MixSetTrackEqAction): MixState {
    return Mix.fromState(state).setTrackEq(action.trackId, action.slot, action.value).toState();
}

function onSetTrackFx(state: MixState, action: MixSetTrackFxAction): MixState {
    return Mix.fromState(state).setTrackFx(action).toState();
}

function onSetTrackMute(state: MixState, action: MixTrackBooleanAction): MixState {
    return Mix.fromState(state).setTrackMuted(action.trackId, action.on).toState();
}

function onSetTrackName(state: MixState, action: MixSetTrackNameAction): MixState {
    return Mix.fromState(state).setTrackName(action.trackId, action.name).toState();
}

function onSetTrackSendFx(state: MixState, action: MixSetTrackSendFxAction): MixState {
    return Mix.fromState(state).setTrackSendFx(action).toState();
}

function onSetTrackSolo(state: MixState, action: MixTrackBooleanAction): MixState {
    return Mix.fromState(state).setTrackSolo(action.trackId, action.on).toState();
}

function onSetTrackVolpan(state: MixState, action: MixSetTrackVolpanAction): MixState {
    return Mix.fromState(state).setTrackVolpan(action).toState();
}

function onSetVisibility(state: MixState, action: MixSetVisibilityAction): MixState {
    return Mix.fromState(state).setVisibility(action).toState();
}

export const mixReducer = createReducer(
    initialState,
    on(mixActions.addTrack, onAddTrack),
    on(mixActions.removeTrack, onRemoveTrack),
    on(mixActions.setAudioTrackRoute, onSetAudioTrackRoute),
    on(mixActions.setTrackEq, onSetTrackEq),
    on(mixActions.setTrackFx, onSetTrackFx),
    on(mixActions.setTrackMute, onSetTrackMute),
    on(mixActions.setTrackName, onSetTrackName),
    on(mixActions.setTrackSendFx, onSetTrackSendFx),
    on(mixActions.setTrackSolo, onSetTrackSolo),
    on(mixActions.setTrackVolpan, onSetTrackVolpan),
    on(mixActions.setVisibility, onSetVisibility),
);