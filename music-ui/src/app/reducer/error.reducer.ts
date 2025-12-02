import { createReducer, on } from "@ngrx/store";
import { ErrorsState } from "../state/error.state";
import { errorActions } from "../action/error.action";

const initialState: ErrorsState = {
    errors: []
};

let sequence = 0;

function onAdd(state: ErrorsState, action: { message: string }): ErrorsState {
    return {
        ...state,
        errors: [...state.errors, {
            id: sequence++,
            message: action.message,
        }],
    };
}

function onRemove(state: ErrorsState, action: { id: number }): ErrorsState {
    return {
        ...state,
        errors: state.errors.filter(it => it.id !== action.id),
    };
}

export const errorReducer = createReducer(
    initialState,
    on(errorActions.add, onAdd),
    on(errorActions.remove, onRemove),
);