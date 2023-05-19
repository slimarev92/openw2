import { createAction, props } from "@ngrx/store";
import { Meal } from "src/app/models/meal";

export const LOAD_MEALS = createAction("[Meals] Load");
export const LOAD_MEALS_FINISHED = createAction("[Meals] Load finished", props<{ meals: Meal[] }>());
export const ADD_MEAL = createAction("[Meals] Add", props<{ mealToAdd: Meal}>());
export const ADD_MEAL_FINISHED = createAction("[Meals] Add finished", props<{ addedMeal: Meal }>());
export const REPLACE_MEAL = createAction("[Meals] Replace", props<{ replacement: Meal }>());
export const REPLACE_MEAL_FINISHED = createAction("[Meals] Replace finished", props<{ replacement: Meal }>());
export const DELETE_MEAL = createAction("[Meals] Delete", props<{ mealToDelete: Meal }>());
export const DELETE_MEAL_FINISHED = createAction("[Meals] Delete finished", props<{ deletedMeal: Meal }>());