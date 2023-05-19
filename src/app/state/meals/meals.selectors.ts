import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { MealsState } from "./meals.state";
import { Meal } from "src/app/models/meal";
import dayjs from "dayjs/esm";
import { calculatePointsAndData } from "src/app/utils/utils";
import { MealItemType } from "src/app/models/meal-type";
import { MealItem } from "src/app/models/meal-item";

export const SELECT_MEALS = (state: AppState) => state.meals;

export const selectAllMeals = createSelector(
    SELECT_MEALS,
    (state: MealsState) => state.meals,
);

export const selectDailyMeals = createSelector(
    selectAllMeals,
    (meals: Meal[]) => {
        const today = dayjs().startOf("d");

        return meals.filter(meal => dayjs(meal.time).isAfter(today));
    }
);

export const selectDailyPoints = createSelector(
    selectDailyMeals,
    (meals) => {
        const [totalPoints] = calculatePointsAndData(meals.flatMap(meal => meal.items), 0, false);

        return totalPoints;
    }
);

export const selectTodaysFruitItems = createSelector(
    selectDailyMeals,
    meals => {
        const dailyItems = meals.flatMap(meal => meal.items);

        const freeItemArray = dailyItems.reduce((freeFruit, currentItem) => {
            if (freeFruit.length >= 3 || currentItem.type !== MealItemType.Fruit) {
                return freeFruit;
            }

            return [...freeFruit, currentItem];
        }, [] as MealItem[]);

        return new Set(freeItemArray);
    }
);

export const selectTodaysFreeProteinItems = createSelector(
    selectDailyMeals,
    meals => meals.flatMap(meal => meal.items).find(item => item.type === MealItemType.Protein)
);
export { MealsState };

