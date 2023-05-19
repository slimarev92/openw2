import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { Meal } from "../models/meal";
import { MealItem } from "../models/meal-item";
import { ADD_MEAL, DELETE_MEAL, LOAD_MEALS, REPLACE_MEAL } from "../state/meals/meals.actions";
import { selectDailyPoints, selectTodaysFruitItems, selectTodaysFreeProteinItems } from "../state/meals/meals.selectors";
import { Store } from "@ngrx/store";
import { AppState } from "../state/app.state";

@Injectable({
    providedIn: "root"
})
export class MealsService {
    private readonly allowedDailyPointsSubject = new BehaviorSubject<number>(26);

    public readonly dailyPoints$ = this.store.select(selectDailyPoints);
    public readonly allowedDailyPoints$ = this.allowedDailyPointsSubject.asObservable();
    public readonly todaysFreeFruitItems$: Observable<Set<MealItem>> = this.store.select(selectTodaysFruitItems);
    public readonly todaysFreeProteinItem$: Observable<MealItem | undefined> = this.store.select(selectTodaysFreeProteinItems);

    // TODO SASHA: DEAL WITH LINT WARN HERE.
    constructor(private readonly store: Store<AppState>) {
        this.store.dispatch(LOAD_MEALS());
    }

    public addMeal(mealToAdd: Meal) {
        this.store.dispatch(ADD_MEAL({ mealToAdd }));
    }

    public replaceMeal(replacement: Meal) {
        this.store.dispatch(REPLACE_MEAL({ replacement }));
    }

    public deleteMeal(mealToDelete: Meal) {
        this.store.dispatch(DELETE_MEAL({ mealToDelete }));
    }
}