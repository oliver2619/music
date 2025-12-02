import { EffectValue } from "../model/effect-value";
import { TrackType } from "../model/track-type";

// track base types

export interface FxState {
    readonly effect: string;
    readonly on: boolean;
    readonly params: Readonly<Record<string, EffectValue>>;
}

export interface NamedTrackState {
    readonly name: string;
}

export interface MutableTrackState {
    readonly solo: boolean;
    readonly muted: boolean;
}

export interface RoutedTrackState {
    readonly groupId: string;
}

export interface SendFxState {
    readonly amount: number;
    readonly fxTrackId: string;
    readonly postRouting: boolean;
}

export interface TrackState {
    readonly type: TrackType;
    readonly id: string;
}

export interface TrackWithEqState {
    readonly eq: readonly number[];
}

export interface TrackWithFxState {
    readonly fx: readonly FxState[];
}

export interface TrackWithSendFxState {
    readonly sendFx: readonly SendFxState[];
}

export interface VolpanTrackState {
    readonly volume: number;
    readonly pan: number;
}

// concrete tracks

export interface AudioTrackState extends TrackState, NamedTrackState, MutableTrackState, RoutedTrackState, TrackWithEqState, TrackWithFxState, TrackWithSendFxState, VolpanTrackState {
    readonly type: TrackType.AUDIO;
}

export interface FxTrackState extends TrackState, NamedTrackState, MutableTrackState, TrackWithEqState, VolpanTrackState {
    readonly type: TrackType.FX;
}

export interface GroupTrackState extends TrackState, NamedTrackState, MutableTrackState, TrackWithEqState, TrackWithFxState, TrackWithSendFxState, VolpanTrackState {
    readonly type: TrackType.GROUP;
}

export interface MasterTrackState extends TrackState, NamedTrackState, TrackWithEqState, TrackWithFxState, VolpanTrackState {
    readonly type: TrackType.MASTER;
}

export interface MidiTrackState extends TrackState, NamedTrackState, MutableTrackState, VolpanTrackState {
    readonly type: TrackType.MIDI;
}

export interface TempoTrackState extends TrackState {
    readonly type: TrackType.TEMPO;
    readonly bpm: number;
}

// the mix

export interface MixVisibilityFilterState {
    readonly audioTrack: boolean;
    readonly eqSection: boolean;
    readonly fxSection: boolean;
    readonly fxTrack: boolean;
    readonly globalTrack: boolean;
    readonly groupTrack: boolean;
    readonly midiTrack: boolean;
    readonly mutedTrack: boolean;
    readonly searchString: string;
    readonly sendSection: boolean;
}

export interface MixState {
    readonly samplerate: number;
    readonly masterTrack: MasterTrackState;
    readonly tempoTrack: TempoTrackState;
    readonly tracks: ReadonlyArray<AudioTrackState | FxTrackState | GroupTrackState | MidiTrackState>;
    readonly visibilityFilter: MixVisibilityFilterState;
    readonly modified: boolean;
    readonly saved: boolean;
}