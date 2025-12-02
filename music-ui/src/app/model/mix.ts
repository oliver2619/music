import { MixSetTrackFxAction, MixSetTrackSendFxAction, MixSetTrackVolpanAction, MixSetVisibilityAction } from "../action/mix.action";
import { AudioTrackState, FxTrackState, GroupTrackState, MasterTrackState, MidiTrackState, MixState, TrackState } from "../state/mix.state";
import { AudioTrack, FxTrack, GroupTrack, MASTER_TRACK_ID, MasterTrack, MidiTrack, TempoTrack, Track } from "./track";
import { TrackType } from "./track-type";

export const MAX_GROUP_TRACKS = 10;
export const MAX_FX_TRACKS = 10;
export const MAX_AUDIO_TRACKS = 50;
export const MAX_MIDI_TRACKS = 50;

export class Mix {

    private constructor(private readonly state: MixState) {
    }

    static newInstance(data: { name: string, samplerate: number, bpm: number }): Mix {
        let ret = new Mix({
            masterTrack: MasterTrack.newInstance(data.name).toState(),
            modified: false,
            samplerate: data.samplerate,
            saved: false,
            tempoTrack: TempoTrack.newInstance(data.bpm).toState(),
            tracks: [],
            visibilityFilter: {
                audioTrack: true,
                eqSection: true,
                fxSection: true,
                fxTrack: true,
                globalTrack: true,
                groupTrack: true,
                midiTrack: true,
                mutedTrack: true,
                searchString: '',
                sendSection: true,
            }
        });
        for (let i = 0; i < 5; ++i) {
            ret = ret.addAudioTrack();
        }
        for (let i = 0; i < 2; ++i) {
            ret = ret.addMidiTrack();
        }
        ret = ret.addFxTrack()
        ret = ret.addGroupTrack()
        return ret;
    }

    static fromState(state: MixState): Mix {
        return new Mix(state);
    }

    addTrack(trackType: TrackType): Mix {
        switch (trackType) {
            case TrackType.AUDIO:
                return this.addAudioTrack();
            case TrackType.FX:
                return this.addFxTrack();
            case TrackType.GROUP:
                return this.addGroupTrack();
            case TrackType.MIDI:
                return this.addMidiTrack();
            default:
                return this;
        }
    }

    addAudioTrack(): Mix {
        if (this.state.tracks.filter(it => it.type === TrackType.AUDIO).length >= MAX_AUDIO_TRACKS) {
            return this;
        }
        return new Mix({
            ...this.state,
            tracks: [...this.state.tracks, AudioTrack.newInstance(this.findNewId(TrackType.AUDIO)).toState()],
            modified: true,
        });
    }

    addFxTrack(): Mix {
        if (this.state.tracks.filter(it => it.type === TrackType.FX).length >= MAX_FX_TRACKS) {
            return this;
        }
        return new Mix({
            ...this.state,
            tracks: [...this.state.tracks, FxTrack.newInstance(this.findNewId(TrackType.FX)).toState()],
            modified: true,
        });
    }

    addGroupTrack(): Mix {
        if (this.state.tracks.filter(it => it.type === TrackType.GROUP).length >= MAX_GROUP_TRACKS) {
            return this;
        }
        return new Mix({
            ...this.state,
            tracks: [...this.state.tracks, GroupTrack.newInstance(this.findNewId(TrackType.GROUP)).toState()],
            modified: true,
        });
    }

    addMidiTrack(): Mix {
        if (this.state.tracks.filter(it => it.type === TrackType.MIDI).length >= MAX_MIDI_TRACKS) {
            return this;
        }
        return new Mix({
            ...this.state,
            tracks: [...this.state.tracks, MidiTrack.newInstance(this.findNewId(TrackType.MIDI)).toState()],
            modified: true,
        });
    }

    removeTrack(trackId: string): Mix {
        return new Mix({
            ...this.state,
            tracks: this.state.tracks
                .filter(it => it.id !== trackId)
                .map(it => Track.fromState(it).removeReferenceToGroupTrack(trackId).removeReferenceToFxTrack(trackId).toState()),
            modified: true,
        });
    }

    setAudioTrackRoute(trackId: string, targetTrackId: string): Mix {
        return this.editTrack(trackId, track => track.route(targetTrackId));
    }

    setTrackEq(trackId: string, slot: number, value: number): Mix {
        return this.editTrack(trackId, track => track.setEq(slot, value));
    }

    setTrackFx(action: MixSetTrackFxAction): Mix {
        return this.editTrack(action.trackId, track => track.setFx(action.slot, {
            effect: action.effect,
            on: action.on,
            parameters: action.parameters,
        }));
    }

    setTrackName(trackId: string, name: string): Mix {
        return this.editTrack(trackId, track => track.setName(name));
    }

    setTrackSendFx(action: MixSetTrackSendFxAction): Mix {
        return this.editTrack(action.trackId, track => track.setSendFx(action.slot, {
            amount: action.amount,
            fxTrackId: action.fxTrackId,
            post: action.post,
        }));
    }

    setTrackMuted(trackId: string, muted: boolean): Mix {
        return this.editTrack(trackId, track => track.setMuted(muted));
    }

    setTrackSolo(trackId: string, solo: boolean): Mix {
        return this.editTrack(trackId, track => track.setSolo(solo));
    }

    setTrackVolpan(action: MixSetTrackVolpanAction): Mix {
        return this.editTrack(action.trackId, track => track.setVolpan(action.volume, action.pan));
    }

    setVisibility(action: MixSetVisibilityAction): Mix {
        const v = this.state.visibilityFilter;
        return new Mix({
            ...this.state,
            visibilityFilter: {
                audioTrack: action.audioTrack ?? v.audioTrack,
                eqSection: action.eqSection ?? v.eqSection,
                fxSection: action.fxSection ?? v.fxSection,
                fxTrack: action.fxTrack ?? v.fxTrack,
                globalTrack: action.globalTrack ?? v.globalTrack,
                groupTrack: action.groupTrack ?? v.groupTrack,
                midiTrack: action.midiTrack ?? v.midiTrack,
                mutedTrack: action.mutedTrack ?? v.mutedTrack,
                searchString: action.searchString ?? v.searchString,
                sendSection: action.sendSection ?? v.sendSection,
            },
            modified: true,
        });
    }

    toState(): MixState {
        return this.state;
    }

    private editTrack(trackId: string, callback: (track: Track<TrackState>) => Track<TrackState>): Mix {
        if (trackId === MASTER_TRACK_ID) {
            return this.editMasterTrack(callback);
        } else {
            return this.editSpecificTrack(trackId, callback);
        }
    }

    private editMasterTrack(callback: (track: Track<TrackState>) => Track<TrackState>): Mix {
        return new Mix({
            ...this.state,
            masterTrack: callback(Track.fromState(this.state.masterTrack)).toState() as MasterTrackState,
            modified: true,
        });
    }

    private editSpecificTrack(trackId: string, callback: (track: Track<TrackState>) => Track<TrackState>): Mix {
        return new Mix({
            ...this.state,
            tracks: this.state.tracks.map(it => {
                if (it.id === trackId) {
                    return callback(Track.fromState(it)).toState() as AudioTrackState | FxTrackState | GroupTrackState | MidiTrackState;
                } else {
                    return it;
                }
            }),
            modified: true,
        })
    }

    private findNewId(trackType: TrackType): string {
        const prefix = TrackType[trackType];
        const existing = new Set(this.state.tracks.filter(it => it.id.startsWith(prefix)).map(it => Number.parseInt(it.id.substring(prefix.length))));
        for (let i = 1; i <= this.state.tracks.length + 1; ++i) {
            if (!existing.has(i)) {
                return `${prefix}${String(i).padStart(2, '0')}`;
            }
        }
        throw new Error('No new track id found');
    }
}