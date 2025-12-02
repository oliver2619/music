import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MixState, MutableTrackState } from "../state/mix.state";
import { TrackType } from "../model/track-type";
import { MAX_AUDIO_TRACKS, MAX_FX_TRACKS, MAX_GROUP_TRACKS, MAX_MIDI_TRACKS } from "../model/mix";

export const mixSelector = createFeatureSelector<MixState>('mix');

export const mixBpmSelector = createSelector(
    mixSelector,
    m => m.tempoTrack.bpm
);

export const mixSamplerateSelector = createSelector(
    mixSelector,
    m => m.samplerate
);

export const mixVisibilitySelector = createSelector(
    mixSelector,
    mix => mix.visibilityFilter
);

export const mixAudioTracksCanInsertSelector = createSelector(
    mixSelector,
    mix => mix.tracks.filter(it => it.type === TrackType.AUDIO).length < MAX_AUDIO_TRACKS
);

export const mixFxTracksSelector = createSelector(
    mixSelector,
    mix => mix.tracks.filter(it => it.type === TrackType.FX)
);

export const mixFxTracksCanInsertSelector = createSelector(
    mixSelector,
    mix => mix.tracks.filter(it => it.type === TrackType.FX).length < MAX_FX_TRACKS
);

export const mixGroupTracksSelector = createSelector(
    mixSelector,
    mix => mix.tracks.filter(it => it.type === TrackType.GROUP)
);

export const mixGroupTracksCanInsertSelector = createSelector(
    mixSelector,
    mix => mix.tracks.filter(it => it.type === TrackType.GROUP).length < MAX_GROUP_TRACKS
);

export const mixMidiTracksCanInsertSelector = createSelector(
    mixSelector,
    mix => mix.tracks.filter(it => it.type === TrackType.MIDI).length < MAX_MIDI_TRACKS
);

export const mixSoloActiveSelector = createSelector(
    mixSelector,
    mix => mix.tracks.some(it => (it as any as MutableTrackState)?.solo === true)
)