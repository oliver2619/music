import { TrackParameter } from "./track-parameter";

export class AudioEffect {
    effect = '';
    readonly fixedParameters = new Map<string, string | boolean>();
    readonly variableParameters = new Map<string, TrackParameter>();
}