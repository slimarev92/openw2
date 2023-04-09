import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, take } from "rxjs";
import dayjs from "dayjs/esm";

import { Meal } from "../models/meal";
import { MealItemType } from "../models/meal-type";
import { MealItem } from "../models/meal-item";
import { calculatePointsAndData } from "src/app/utils/utils";
import { DbService } from "./db.service";

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

    private readonly mealsSubject = new BehaviorSubject<Meal[]>([]);

    private readonly allowedDailyPointsSubject = new BehaviorSubject<number>(26);

    public readonly dailyMeals$: Observable<Meal[]> = this.mealsSubject.pipe(map(meals => {
        const today = dayjs().startOf("d");

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

    constructor(private dbService: DbService) {
        this.dbService.db$.pipe(take(1)).subscribe(async db => {
            const store = db.transaction("meals").store;

            let allMeals: Meal[] = [];

            try {
                allMeals = await store.getAll();

                this.mealsSubject.next(allMeals);
            } catch (e) {
                console.error(`Can't get all meals from db due to error: ${e}`);
            }
        });
    }

    public addMeal(meal: Meal) {
        this.dbService.db$.pipe(take(1)).subscribe(async db => {
            const tx = db.transaction("meals", "readwrite");
            const store = tx.store;

            try {
                await store.add(meal);

                this.mealsSubject.next([...this.mealsSubject.value, meal]);
            } catch (e) {
                console.error(`Can't add item to db due to error: ${e}`);
            }
        });
    }

    public replaceMeal(oldMeal: Meal, replacement: Meal) {
        this.dbService.db$.pipe(take(1)).subscribe(async db => {
            try {
                const store = db.transaction("meals", "readwrite").store;

                await store.put(replacement);

            } catch (e) {
                console.log(`Can't replace meal due to error: ${e}`);

                return;
            }

            const oldMealIndex = this.mealsSubject.value.findIndex(curr => curr === oldMeal);

            if (oldMealIndex === -1) {
                return;
            }
    
            const modifiedMeals = [...this.mealsSubject.value];
    
            modifiedMeals.splice(oldMealIndex, 1, replacement);
    
            this.mealsSubject.next(modifiedMeals);
        });
    }

    public deleteMeal(mealToDelete: Meal) {
        this.dbService.db$.pipe(take(1)).subscribe(async db => {
            try {
                const store = db.transaction("meals", "readwrite").store;

                await store.delete(mealToDelete.name);

            } catch (e) {
                console.log(`Can't delete meal due to error: ${e}`);

                return;
            }

            this.mealsSubject.next(this.mealsSubject.value.filter(curr => curr !== mealToDelete));
        });
    }
}