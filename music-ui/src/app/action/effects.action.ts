import { createActionGroup, props } from "@ngrx/store";
import { EffectsJson } from "../service/effects.service";

export interface EffectsSetAction {
    effects: EffectsJson;
}

export const effectsActions = createActionGroup({
    source: 'Effects',
    events: {
        set: props<EffectsSetAction>(),
    }
});