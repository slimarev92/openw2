import { Injectable } from "@angular/core";
import { from } from "rxjs";

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

    // todo sasha: make this work
    public itemDescriptions$ = from([...this.itemDescriptions]);
}