import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { from, map, switchMap, tap } from "rxjs";
import { DbService } from "src/app/services/db.service";
import { ADD_MEAL, ADD_MEAL_FINISHED, DELETE_MEAL, DELETE_MEAL_FINISHED, LOAD_MEALS, LOAD_MEALS_FINISHED, REPLACE_MEAL, REPLACE_MEAL_FINISHED } from "./meals.actions";
import { Meal } from "src/app/models/meal";

export const LOAD_MEALS_EFFECT = createEffect((actions = inject(Actions), dbService = inject(DbService)) => {
    return actions.pipe(
        ofType(LOAD_MEALS),
        switchMap(() => {
            const getAllMeals = async () => {
                const db = await dbService.dbPromise;
                const store = db.transaction("meals").store;

                return store.getAll() as Promise<Meal[]>;
            };

            return from(getAllMeals());
        }),
        map(meals => LOAD_MEALS_FINISHED({ meals }))
    );
}, { functional: true });

export const ADD_MEAL_EFFECT = createEffect((actions = inject(Actions), dbService = inject(DbService)) => {
    return actions.pipe(
        ofType(ADD_MEAL),
        switchMap(({ mealToAdd: meal }) => {
            const addMeal = async () => {
                const db = await dbService.dbPromise;
                const tx = db.transaction("meals", "readwrite");

                // TODO SASHA: MEAL INCLUDES THE ACTION NAME!
                await tx.store.add(meal);

                return meal;
            };

            return from(addMeal());
        }),
        map(meal => ADD_MEAL_FINISHED({ addedMeal: meal }))
    );
}, { functional: true });

export const REPLACE_MEAL_EFFECT = createEffect((actions = inject(Actions), dbService = inject(DbService)) => {
    return actions.pipe(
        ofType(REPLACE_MEAL),
        switchMap(({ replacement }) => {
            const replaceMeal = async () => {
                const db = await dbService.dbPromise;
                const tx = db.transaction("meals", "readwrite");

                // TODO SASHA: REPLACEMENT MEAL INCLUDES THE ACTION NAME!
                await tx.store.put(replacement);

                return replacement;
            };

            return from(replaceMeal());
        }),
        map(replacement => REPLACE_MEAL_FINISHED({ replacement }))
    );
}, { functional: true });

export const DELETE_MEAL_EFFECT = createEffect((actions = inject(Actions), dbService = inject(DbService)) => {
    return actions.pipe(
        ofType(DELETE_MEAL),
        switchMap(({ mealToDelete }) => {
            const deleteMeal = async () => {
                const db = await dbService.dbPromise;
                const store = db.transaction("meals", "readwrite").store;

                await store.delete(mealToDelete.name);

                return mealToDelete;
            };
            
            return from(deleteMeal());
        }),
        map(deletedMeal => DELETE_MEAL_FINISHED({ deletedMeal }))
    );
}, { functional: true });

export const MEALS_EFFECTS = {LOAD_MEALS_EFFECT, ADD_MEAL_EFFECT, REPLACE_MEAL_EFFECT, DELETE_MEAL_EFFECT};