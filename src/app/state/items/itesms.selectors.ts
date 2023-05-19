import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const selectItems = (state: AppState) => state.items;

export const selectAllItems = createSelector(
    selectItems,
    itemsState => itemsState.items
);