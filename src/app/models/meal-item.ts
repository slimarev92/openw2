import { MealItemType } from "./meal-type";

export type MealItem = {
    name: string,
    points: number,
    type: MealItemType,
    amount?: number,
    calculatedPoints?: number
}

