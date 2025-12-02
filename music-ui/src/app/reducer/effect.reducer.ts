import { createReducer, on } from "@ngrx/store";
import { EffectsJson } from "../service/effects.service";
import { effectsActions, EffectsSetAction } from "../action/effects.action";

const initialState: EffectsJson = {};

function onSet(state: EffectsJson, action: EffectsSetAction): EffectsJson {
    return action.effects;
}

export const effectsReducer = createReducer(
    initialState,
    on(effectsActions.set, onSet),
);