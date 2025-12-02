import { FormGroup } from "@angular/forms";
import { concat, map, Observable, of } from "rxjs";
import { Unit } from "./model/unit";

export function formGroupValidChange(formGroup: FormGroup): Observable<boolean> {
    return concat(of(formGroup.valid), formGroup.valueChanges.pipe(map(() => formGroup.valid)));
}

export function convertNumSamplesUsingUnit(numSamples: number, opt: { unit: Unit, samplerate: number, bpm: number }): number {
    switch (opt.unit) {
        case 'beats':
            return numSamples * opt.bpm / (opt.samplerate * 60);
        case 'samples':
            return numSamples;
        case 'seconds':
            return numSamples / opt.samplerate;
    }
}

export function convertUnitToNumSamples(value: number, opt: { unit: Unit, samplerate: number, bpm: number }): number {
    switch (opt.unit) {
        case 'beats':
            return Math.floor(value * opt.samplerate * 60 / opt.bpm);
        case 'samples':
            return value;
        case 'seconds':
            return Math.floor(value * opt.samplerate);
    }
}

export function convertAmplitudeToDb(value: number): number {
    return value > 0 ? 10 * Math.log10(value) : Number.NEGATIVE_INFINITY;
}
