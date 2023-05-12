import { MealItemDescription } from "../models/meal-item-description";
import { MealItemType } from "../models/meal-type";

export const ITEM_DESCRIPTIONS: MealItemDescription[] = [
    {
        canonicalName: "Hummus",
        name: $localize `Hummus`,
        type: MealItemType.Protein, 
        points: 10
    },
    {
        canonicalName: "Hummus2",
        name: $localize `Hummus2`,
        type: MealItemType.Protein, 
        points: 10
    },
    {
        canonicalName: "Apple",
        name: $localize `Apple`,
        type: MealItemType.Fruit, 
        points: 5
    },
    {
        canonicalName: "Loaf of bread",
        name: $localize `Loaf of bread`,
        type: MealItemType.Regular, 
        points: 2
    }
];