import { createReducer, on } from "@ngrx/store";
import { CREATE_ITEM_FINISHED, IMPORT_ITEMS_FINISHED } from "./items.actions";
import { ItemsState } from "./items.state";

export const itemsReducer = createReducer<ItemsState>(
    { items: []},

    on(IMPORT_ITEMS_FINISHED, (state, { importedItems }): ItemsState => {
        return {
            items: [...state.items, ...importedItems]
        };
    }),


    on(CREATE_ITEM_FINISHED, (state, { createdItem }): ItemsState => {
        return {
            items: [...state.items, createdItem]
        };
    })
);