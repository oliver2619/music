import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ErrorsState } from "../state/error.state";

const errorSelector = createFeatureSelector<ErrorsState>('error');

export const errorsSelector = createSelector(
    errorSelector,
    e => e.errors,
);