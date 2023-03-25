import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import dayjs from "dayjs/esm";

import { Meal } from "../models/meal";
import { MealItemType } from "../models/meal-type";
import { MealItem } from "../models/meal-item";
import { calculatePointsAndData } from "src/app/utils/utils";

@Injectable({
    providedIn: "root"
})
export class MealsService {
    private meals: Meal[] = [
        {
            name: "breakfast",
            time: new Date(2023, 0, 13, 15, 23),
            items: [
                {
                    name: "Avocado, quarter",
                    points: 1,
                    amount: 1,
                    type: MealItemType.Vegetable, // todo sasha: check this with yasmin
                },
                {
                    name: "Watermelon, medium slice, 250 g",
                    points: 5,
                    amount: 2,
                    type: MealItemType.Fruit, // todo sasha: check this with yasmin
                },
            ]
        },
        {
            name: "lunch",
            time: new Date(2023, 0, 13, 16, 23),
            items: [
                {
                    name: "Avocado, quarter",
                    points: 1,
                    amount: 1,
                    type: MealItemType.Vegetable, // todo sasha: check this with yasmin
                },
                {
                    name: "Watermelon, medium slice, 250 g",
                    points: 5,
                    amount: 2,
                    type: MealItemType.Fruit, // todo sasha: check this with yasmin
                },
            ]
        },
    ];

    private readonly mealsSubject = new BehaviorSubject<Meal[]>(this.meals);

    private readonly allowedDailyPointsSubject = new BehaviorSubject<number>(26);

    public readonly dailyMeals$: Observable<Meal[]> = this.mealsSubject.pipe(map(meals => {
        const today = dayjs().startOf('d');

        return meals.filter(meal => dayjs(meal.time).isAfter(today));
    }));

    public readonly dailyPoints$: Observable<number> = this.dailyMeals$.pipe(map(meals => {
        const [totalPoints, _] = calculatePointsAndData(meals.flatMap(meal => meal.items), 0, false);

        return totalPoints;
    }));

    public readonly allowedDailyPoints$ = this.allowedDailyPointsSubject.asObservable();

    public readonly todaysFreeFruitItems$: Observable<Set<MealItem>> = this.dailyMeals$.pipe(map(meals => {
        const dailyItems = meals.flatMap(meal => meal.items);

        const freeItemArray = dailyItems.reduce((freeFruit, currentItem) => {
            if (freeFruit.length >= 3 || currentItem.type !== MealItemType.Fruit) {
                return freeFruit;
            }

            return [...freeFruit, currentItem];
        }, [] as MealItem[]);

        return new Set(freeItemArray);
    }));

    public readonly todaysFreeProteinItem$: Observable<MealItem | undefined> = this.dailyMeals$.pipe(map(meals => {
        return meals.flatMap(meal => meal.items).find(item => item.type === MealItemType.Protein);
    }));

    public addMeal(meal: Meal) {
        this.mealsSubject.next([...this.mealsSubject.value, meal]);
    }

    public replaceMeal(oldMeal: Meal, replacement: Meal) {
        const oldMealIndex = this.mealsSubject.value.findIndex(curr => curr === oldMeal);

        if (oldMealIndex === -1) {
            return;
        }

        const modifiedMeals = [...this.mealsSubject.value];

        modifiedMeals.splice(oldMealIndex, 1, replacement);

        this.mealsSubject.next(modifiedMeals);
    }

    public deleteMeal(mealToDelete: Meal) {
        this.mealsSubject.next(this.mealsSubject.value.filter(curr => curr !== mealToDelete));
    }
}