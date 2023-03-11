import { MealItem } from "./meal-item";

export type Meal = {
    name: string,
    time: Date,
    items: MealItem[]
}