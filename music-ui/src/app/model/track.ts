import { AudioTrackState, FxState, FxTrackState, GroupTrackState, MasterTrackState, MidiTrackState, MutableTrackState, NamedTrackState, RoutedTrackState, SendFxState, TempoTrackState, TrackState, TrackWithEqState, TrackWithFxState, TrackWithSendFxState, VolpanTrackState } from "../state/mix.state";
import { EffectValue } from "./effect-value";
import { TrackType } from "./track-type";

export const MAX_EQ_PER_TRACK = 3;
export const MAX_SEND_FX_PER_TRACK = 2;
export const MAX_FX_PER_TRACK = 2;
export const MASTER_TRACK_ID = 'MASTER';
export const VOLUME_TRACK_ID = 'VOLUME';
const DEFAULT_VOLUME = 0.8;

function createEqDefaults(): readonly number[] {
    const ret: number[] = new Array(MAX_EQ_PER_TRACK);
    for (let i = 0; i < MAX_EQ_PER_TRACK; ++i) {
        ret[i] = 0;
    }
    return ret;
}

function createFxDefaults(): readonly FxState[] {
    const ret: FxState[] = new Array(MAX_FX_PER_TRACK);
    for (let i = 0; i < MAX_FX_PER_TRACK; ++i) {
        ret[i] = {
            effect: '',
            on: false,
            params: {},
        };
    }
    return ret;
}

function createSendFxDefaults(): readonly SendFxState[] {
    const ret: SendFxState[] = new Array(MAX_SEND_FX_PER_TRACK);
    for (let i = 0; i < MAX_SEND_FX_PER_TRACK; ++i) {
        ret[i] = {
            amount: 0,
            fxTrackId: '',
            postRouting: false,
        };
    }
    return ret;
}

class EqSet {
    private constructor(private readonly state: readonly number[]) { }

    static fromState(state: readonly number[]): EqSet {
        return new EqSet(state);
    }

    set(slot: number, value: number): EqSet {
        return new EqSet(this.state.map((eqValue, s) => {
            if (s === slot) {
                return value;
            } else {
                return eqValue;
            }
        }));
    }

    toState(): readonly number[] {
        return this.state;
    }
}

class FxSet {
    private constructor(private readonly state: readonly FxState[]) { }

    static fromState(state: readonly FxState[]): FxSet {
        return new FxSet(state);
    }

    set(slot: number, data: { effect?: string | undefined, on?: boolean | undefined, parameters?: Readonly<Record<string, EffectValue>> | undefined }): FxSet {
        return new FxSet(this.state.map((f, s) => {
            if (s === slot) {
                return {
                    effect: data.effect ?? f.effect,
                    on: data.on ?? f.on,
                    params: { ...f.params, ...data.parameters ?? {} },
                };
            } else {
                return f;
            }
        }));
    }

    toState(): readonly FxState[] {
        return this.state;
    }
}

class SendFxSet {
    private constructor(private readonly state: readonly SendFxState[]) { }

    static fromState(state: readonly SendFxState[]): SendFxSet {
        return new SendFxSet(state);
    }

    removeReferenceToFxTrack(fxTrackId: string): SendFxSet {
        return new SendFxSet(this.state.map(sf => {
            if (sf.fxTrackId === fxTrackId) {
                return {
                    ...sf,
                    fxTrackId: ''
                };
            } else {
                return sf;
            }
        }));
    }

    set(slot: number, data: { amount?: number | undefined, fxTrackId?: string | undefined, post?: boolean | undefined }): SendFxSet {
        return new SendFxSet(this.state.map((sf, s) => {
            if (s === slot) {
                return {
                    amount: data.amount ?? sf.amount,
                    fxTrackId: data.fxTrackId ?? sf.fxTrackId,
                    postRouting: data.post ?? sf.postRouting,
                };
            } else {
                return sf;
            }
        }));
    }

    toState(): readonly SendFxState[] {
        return this.state;
    }
}

export class Track<S extends TrackState> {

    protected constructor(protected readonly state: S) { }

    static fromState<S extends TrackState>(state: S): Track<S> {
        return new Track(state);
    }

    removeReferenceToFxTrack(fxTrackId: string): Track<S> {
        const sendFx = (this.state as any as TrackWithSendFxState).sendFx;
        if (sendFx == undefined) {
            return this;
        } else {
            return new Track({
                ...this.state,
                sendFx: SendFxSet.fromState(sendFx).removeReferenceToFxTrack(fxTrackId).toState(),
            });
        }
    }

    removeReferenceToGroupTrack(groupTrackId: string): Track<S> {
        const groupId = (this.state as any as RoutedTrackState).groupId;
        if (groupId === groupTrackId) {
            return new Track({
                ...this.state,
                groupId: MASTER_TRACK_ID
            });
        } else {
            return this;
        }
    }

    route(targetTrackId: string): Track<S> {
        const groupId = (this.state as any as RoutedTrackState).groupId;
        if (groupId === undefined) {
            return this;
        } else {
            return new Track({ ...this.state, groupId: targetTrackId });
        }

    }

    setEq(slot: number, value: number): Track<S> {
        const eq = (this.state as any as TrackWithEqState).eq;
        if (eq === undefined) {
            return this;
        } else {
            return new Track({
                ...this.state,
                eq: EqSet.fromState(eq).set(slot, value).toState(),
            });
        }
    }

    setFx(slot: number, data: { effect?: string | undefined, on?: boolean | undefined, parameters?: Readonly<Record<string, EffectValue>> | undefined }): Track<S> {
        const fx = (this.state as any as TrackWithFxState).fx;
        if (fx == undefined) {
            return this;
        } else {
            return new Track({
                ...this.state,
                fx: FxSet.fromState(fx).set(slot, data).toState(),
            });
        }
    }

    setMuted(muted: boolean): Track<S> {
        const sm = (this.state as any as MutableTrackState);
        if (sm.muted == undefined || sm.solo == undefined) {
            return this;
        } else {
            return new Track({
                ...this.state,
                muted,
                solo: muted ? false : sm.solo,
            });
        }
    }

    setName(name: string): Track<S> {
        const n = (this.state as any as NamedTrackState).name;
        if (n == undefined) {
            return this;
        } else {
            return new Track({ ...this.state, name });
        }
    }

    setSendFx(slot: number, data: { amount?: number | undefined, fxTrackId?: string | undefined, post?: boolean | undefined }): Track<S> {
        const sendFx = (this.state as any as TrackWithSendFxState).sendFx;
        if (sendFx == undefined) {
            return this;
        } else {
            return new Track({
                ...this.state,
                sendFx: SendFxSet.fromState(sendFx).set(slot, data).toState(),
            });
        }
    }

    setSolo(solo: boolean): Track<S> {
        const sm = (this.state as any as MutableTrackState);
        if (sm.muted == undefined || sm.solo == undefined) {
            return this;
        } else {
            return new Track({
                ...this.state,
                solo,
                muted: solo ? false : sm.muted,
            });
        }
    }

    setVolpan(volume: number | undefined, pan: number | undefined): Track<S> {
        const vp = (this.state as any as VolpanTrackState);
        if (vp.volume == undefined || vp.pan == undefined) {
            return this;
        } else {
            return new Track({
                ...this.state,
                pan: pan ?? vp.pan,
                volume: volume ?? vp.volume,
            });
        }
    }

    toState(): S {
        return this.state;
    }
}

export class AudioTrack extends Track<AudioTrackState> {

    private constructor(state: AudioTrackState) {
        super(state);
    }

    static newInstance(id: string): AudioTrack {
        return new AudioTrack({
            eq: createEqDefaults(),
            fx: createFxDefaults(),
            groupId: MASTER_TRACK_ID,
            id,
            muted: false,
            name: '',
            pan: 0,
            sendFx: createSendFxDefaults(),
            solo: false,
            type: TrackType.AUDIO,
            volume: DEFAULT_VOLUME,
        });
    }
}

export class FxTrack extends Track<FxTrackState> {

    private constructor(state: FxTrackState) {
        super(state);
    }

    static newInstance(id: string): FxTrack {
        return new FxTrack({
            eq: createEqDefaults(),
            id,
            muted: false,
            name: '',
            pan: 0,
            solo: false,
            type: TrackType.FX,
            volume: DEFAULT_VOLUME,
        });
    }
}

export class GroupTrack extends Track<GroupTrackState> {

    private constructor(state: GroupTrackState) {
        super(state);
    }

    static newInstance(id: string): GroupTrack {
        return new GroupTrack({
            eq: createEqDefaults(),
            fx: createFxDefaults(),
            id,
            muted: false,
            name: '',
            pan: 0,
            sendFx: createSendFxDefaults(),
            solo: false,
            type: TrackType.GROUP,
            volume: DEFAULT_VOLUME,
        });
    }
}

export class MasterTrack extends Track<MasterTrackState> {

    private constructor(state: MasterTrackState) {
        super(state);
    }

    static newInstance(name: string): MasterTrack {
        return new MasterTrack({
            eq: createEqDefaults(),
            fx: createFxDefaults(),
            id: MASTER_TRACK_ID,
            name,
            pan: 0,
            type: TrackType.MASTER,
            volume: DEFAULT_VOLUME,
        });
    }
}

export class MidiTrack extends Track<MidiTrackState> {

    private constructor(state: MidiTrackState) {
        super(state);
    }

    static newInstance(id: string): MidiTrack {
        return new MidiTrack({
            id,
            muted: false,
            name: '',
            pan: 0,
            solo: false,
            type: TrackType.MIDI,
            volume: DEFAULT_VOLUME,
        });
    }
}

export class TempoTrack extends Track<TempoTrackState> {

    private constructor(state: TempoTrackState) {
        super(state);
    }

    static newInstance(bpm: number): TempoTrack {
        return new TempoTrack({
            bpm,
            id: VOLUME_TRACK_ID,
            type: TrackType.TEMPO,
        })
    }
}
