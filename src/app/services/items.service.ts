import { Injectable } from "@angular/core";
import { BehaviorSubject, from } from "rxjs";

import { MealItemDescription } from "../models/meal-item-description";
import { MealItemType } from "../models/meal-type";


@Injectable({
    providedIn: "root"
})
export class ItemsService {
    public itemDescriptions: MealItemDescription[] = [
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

    private readonly itemDescriptionsSubject = new BehaviorSubject<MealItemDescription[]>([...this.itemDescriptions]);

    // todo sasha: make this work for real
    public itemDescriptions$ = this.itemDescriptionsSubject.asObservable();

    public createItem(item: MealItemDescription) {
        this.itemDescriptionsSubject.next([...this.itemDescriptionsSubject.value, item]);
    }

    public getItemByName(itemName: string) {
        return this.itemDescriptionsSubject.value.find(currItem => currItem.name === itemName);
    }
}