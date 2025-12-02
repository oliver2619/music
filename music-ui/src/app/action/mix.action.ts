import { createActionGroup, props } from "@ngrx/store";
import { EffectValue } from "../model/effect-value";
import { TrackType } from "../model/track-type";

export interface MixAddTrackAction {
    readonly trackType: TrackType;
}

export interface MixTrackAction {
    readonly trackId: string;
}

export interface MixTrackBooleanAction {
    readonly trackId: string;
    readonly on: boolean;
}

export interface MixSetAudioTrackRouteAction {
    readonly trackId: string;
    readonly targetTrackId: string;
}

export interface MixSetTrackNameAction {
    readonly trackId: string;
    readonly name: string;
}

export interface MixSetTrackEqAction {
    readonly trackId: string;
    readonly slot: number;
    readonly value: number;
}

export interface MixSetTrackFxAction {
    readonly trackId: string;
    readonly slot: number;
    readonly on?: boolean | undefined;
    readonly effect?: string | undefined;
    readonly parameters?: Readonly<Record<string, EffectValue>> | undefined;
}

export interface MixSetTrackSendFxAction {
    readonly trackId: string;
    readonly slot: number;
    readonly fxTrackId?: string | undefined;
    readonly amount?: number | undefined;
    readonly post?: boolean | undefined;
}

export interface MixSetTrackVolpanAction {
    readonly trackId: string;
    readonly volume?: number | undefined;
    readonly pan?: number | undefined;
}

export interface MixSetVisibilityAction {
    readonly audioTrack?: boolean | undefined;
    readonly eqSection?: boolean | undefined;
    readonly fxSection?: boolean | undefined;
    readonly fxTrack?: boolean | undefined;
    readonly globalTrack?: boolean | undefined;
    readonly groupTrack?: boolean | undefined;
    readonly midiTrack?: boolean | undefined;
    readonly mutedTrack?: boolean | undefined;
    readonly searchString?: string | undefined;
    readonly sendSection?: boolean | undefined;
}

export const mixActions = createActionGroup({
    source: 'Mix',
    events: {
        addTrack: props<MixAddTrackAction>(),
        removeTrack: props<MixTrackAction>(),
        setAudioTrackRoute: props<MixSetAudioTrackRouteAction>(),
        setTrackEq: props<MixSetTrackEqAction>(),
        setTrackFx: props<MixSetTrackFxAction>(),
        setTrackMute: props<MixTrackBooleanAction>(),
        setTrackName: props<MixSetTrackNameAction>(),
        setTrackSendFx: props<MixSetTrackSendFxAction>(),
        setTrackSolo: props<MixTrackBooleanAction>(),
        setTrackVolpan: props<MixSetTrackVolpanAction>(),
        setVisibility: props<MixSetVisibilityAction>(),
    },
});