import { MealItemType } from "./meal-type";

export type MealItemDescription = {
    canonicalName: string,
    name: string,
    points: number,
    type: MealItemType
}