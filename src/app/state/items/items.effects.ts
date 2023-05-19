import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DbService } from "src/app/services/db.service";
import { CREATE_ITEM, CREATE_ITEM_FINISHED, IMPORT_ITEMS, IMPORT_ITEMS_FINISHED } from "./items.actions";
import { map, from, switchMap } from "rxjs";

export const LOAD_ITEMS_EFFECT = createEffect((actions = inject(Actions), dbService = inject(DbService)) => {
    return actions.pipe(
        ofType(IMPORT_ITEMS),
        switchMap(() => {
            const loadItemsFromDb = async () => {
                const db = await dbService.dbPromise;
                let store = db.transaction("items", "readwrite").store;
                const itemsCount = await store.count();
    
                if (!itemsCount) {
                    const allItems = (await import("src/app/data/initial-items")).ITEM_DESCRIPTIONS;

                    store = db.transaction("items", "readwrite").store;
    
                    await Promise.all(allItems.map(item => store.add(item)));
                }
                
                return store.getAll();
            };

            return from(loadItemsFromDb());
        }),
        map(importedItems => IMPORT_ITEMS_FINISHED({ importedItems }))
    );
}, { functional: true });

export const CREATE_ITEM_EFFECT = createEffect((actions = inject(Actions), dbService = inject(DbService)) => {
    return actions.pipe(
        ofType(CREATE_ITEM),
        switchMap(({ itemToCreate }) => {
            const createItem = async () => {
                const db = await dbService.dbPromise;
                const store = db.transaction("items", "readwrite").store;

                await store.add(itemToCreate);

                return itemToCreate;
            };

            return from(createItem());
        }),
        map(createdItem => CREATE_ITEM_FINISHED({ createdItem }))
    );
}, { functional: true });

export const ITEM_EFFECTS = { LOAD_ITEMS_EFFECT, CREATE_ITEM_EFFECT };
