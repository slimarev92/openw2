import { Injectable } from "@angular/core";

import { MealItemDescription } from "../models/meal-item-description";
import { Store } from "@ngrx/store";
import { CREATE_ITEM, IMPORT_ITEMS } from "../state/items/items.actions";
import { selectAllItems } from "../state/items/itesms.selectors";
import { AppState } from "../state/app.state";


@Injectable({
    providedIn: "root"
})
export class ItemsService {
    public readonly itemDescriptions$ = this.store.select(selectAllItems);
    
    constructor(private readonly store: Store<AppState>) {
        store.dispatch(IMPORT_ITEMS());
    }

    public createItem(itemToCreate: MealItemDescription) {
        this.store.dispatch(CREATE_ITEM({ itemToCreate }));
    }
}