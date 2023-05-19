import { createReducer, on } from "@ngrx/store";
import { MealsState } from "./meals.state";
import { ADD_MEAL_FINISHED, DELETE_MEAL_FINISHED, LOAD_MEALS_FINISHED, REPLACE_MEAL_FINISHED } from "./meals.actions";

export const mealsReducer = createReducer<MealsState>(
    { meals: [] },

    on(LOAD_MEALS_FINISHED, (_, payload): MealsState => {
        return {
            meals: payload.meals
        };
    }),

    on(ADD_MEAL_FINISHED, (mealsState, { addedMeal }): MealsState=> {
        return {
            meals: [...mealsState.meals, addedMeal]
        };
    }),

    on(REPLACE_MEAL_FINISHED, (mealsState, { replacement }) => {
        const mealToReplaceIndex = mealsState.meals.findIndex(m => m.name === replacement.name);
        const newMeals = [...mealsState.meals];

        newMeals[mealToReplaceIndex] = replacement;
 
        return {
            meals: newMeals
        };
    }),

    on(DELETE_MEAL_FINISHED, (mealsState, { deletedMeal }) => {
        return {
            meals: mealsState.meals.filter(m => m.name !== deletedMeal.name)
        };
    })
);