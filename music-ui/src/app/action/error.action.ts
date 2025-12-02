import { createActionGroup, props } from "@ngrx/store";

export const errorActions = createActionGroup({
    source: 'Error',
    events: {
        add: props<{ message: string }>(),
        remove: props<{ id: number }>(),
    }
});