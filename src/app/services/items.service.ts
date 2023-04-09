import { Injectable } from "@angular/core";
import { BehaviorSubject, take } from "rxjs";

import { MealItemDescription } from "../models/meal-item-description";
import { MealItemType } from "../models/meal-type";
import { DbService } from "./db.service";

const ITEM_DESCRIPTIONS: MealItemDescription[] = [
    {
        name: "Hummus",
        type: MealItemType.Protein, 
        points: 10
    },
    {
        name: "Hummus2",
        type: MealItemType.Protein, 
        points: 10
    },
    {
        name: "Apple",
        type: MealItemType.Fruit, 
        points: 5
    },
    {
        name: "Loaf of bread",
        type: MealItemType.Regular, 
        points: 2
    }
];

@Injectable({
    providedIn: "root"
})
export class ItemsService {
    private readonly itemDescriptionsSubject = new BehaviorSubject<MealItemDescription[]>([]);

    public itemDescriptions$ = this.itemDescriptionsSubject.asObservable();

    constructor(private dbService: DbService) {
        dbService.db$.pipe(take(1)).subscribe(async db => {
            const tx = db.transaction("items", "readwrite");
            const store = tx.store;
            const itemsCount = await store.count();

            if (!itemsCount) {
                await Promise.all(ITEM_DESCRIPTIONS.map(id => store.add(id)));
            }
            
            const allItems = await store.getAll();

            this.itemDescriptionsSubject.next(allItems);
        });
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