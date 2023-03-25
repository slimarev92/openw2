import { MealItem } from "../models/meal-item";
import { MealItemType } from "../models/meal-type";

export function calculatePointsAndData(items: MealItem[], todaysFruitAmount: number, usedFreeProteinToday: boolean): [number, Set<number>] {
    const freeItemIndexes = new Set<number>();
    const calculatedPoints = items.reduce((total, curr, index) => {
        let amountToAdd = curr.amount * curr.points;

        if (curr.type === MealItemType.Fruit && todaysFruitAmount < 3) {
            amountToAdd = 0;
            todaysFruitAmount++;
            freeItemIndexes.add(index);
        } else if (curr.type === MealItemType.Protein && !usedFreeProteinToday) {
            usedFreeProteinToday = true;
            freeItemIndexes.add(index);
            amountToAdd = 0;
        }

        return total + amountToAdd;
    }, 0);

    return [calculatedPoints, freeItemIndexes];
}