import { Injectable } from "@angular/core";
import { BehaviorSubject, take } from "rxjs";

import { MealItemDescription } from "../models/meal-item-description";
import { DbService } from "./db.service";


@Injectable({
    providedIn: "root"
})
export class ItemsService {
    private readonly itemDescriptionsSubject = new BehaviorSubject<MealItemDescription[]>([]);

    public itemDescriptions$ = this.itemDescriptionsSubject.asObservable();

    constructor(private dbService: DbService) {
        dbService.db$.pipe(take(1)).subscribe(async db => {
            let store = db.transaction("items", "readwrite").store;
            const itemsCount = await store.count();

            if (!itemsCount) {
                const allItems = await this.fetchItems();

                store = db.transaction("items", "readwrite").store;

                await Promise.all(allItems.map(item => store.add(item)));
            }
            
            const allItems = await store.getAll();

            this.itemDescriptionsSubject.next(allItems);
        });
    }

    private async fetchItems(): Promise<MealItemDescription[]> {
        const res = await fetch("/api/items");

        return await res.json();
    }

    public createItem(item: MealItemDescription) {
        this.dbService.db$.pipe(take(1)).subscribe(async db => {
            const tx = db.transaction("items", "readwrite");
            const store = tx.store;
          
            if (await store.get(item.name)) {
                console.error(`Tried to add item with a name that already exists - ${item.name}`);

                return;
            }

            try {
                store.add(item);
            } catch (e) {
                console.log(`Failed adding item: ${item.name} due to error: ${e}`);
            }

            this.itemDescriptionsSubject.next([...this.itemDescriptionsSubject.value, item]);
        });
    }

    public getItemByName(itemName: string) {
        return this.itemDescriptionsSubject.value.find(currItem => currItem.name === itemName);
    }
}