import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EffectsJson } from "../service/effects.service";

export const effectsSelector = createFeatureSelector<EffectsJson>('effects');

export const effectNamesSelector = createSelector(
    effectsSelector,
    e => Object.keys(e)
);