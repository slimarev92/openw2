import { MealItemDescription } from "../models/meal-item-description";
import { MealItemType } from "../models/meal-type";

export const ITEM_DESCRIPTIONS: MealItemDescription[] = [
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