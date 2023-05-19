
import { AsyncPipe, DatePipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable, take } from "rxjs";
import { Meal } from "src/app/models/meal";
import { MealItemType } from "src/app/models/meal-type";
import { DialogService } from "src/app/services/dialog.service";
import { AddMealComponent } from "src/app/components/add-meal/add-meal.component";
import { MealsService } from "src/app/services/meals.service";
import { MealItem } from "src/app/models/meal-item";
import { selectDailyMeals } from "src/app/state/meals/meals.selectors";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/state/app.state";

@Component({
    selector: "oww-daily-overview",
    template: `
        <h2 i18n>Today's Overview - {{today | date: 'shortDate'}} - {{mealsService.dailyPoints$ | async}} / {{mealsService.allowedDailyPoints$ | async}} Points</h2>
        <button (click)="addMeal(addMealModal)" i18n>Add Meal</button>

        <ng-container *ngFor="let meal of dailyMeals$ | async; let i = index">
            <h3>{{ i + 1}}: {{ meal.time | date: 'shortTime'}} <button (click)="editMeal(meal, addMealModal)">E</button><button (click)="deleteMeal(meal)">X</button></h3>
            <ul>
                <li *ngFor="let item of meal.items">
                    <h4>{{item.name}}</h4>
                    <p>{{item.points}}x{{ item.amount }} = <span [class.free-item]="freeFruitItems.has(item) || freeProteinItem === item">{{ (item.points || 0) * (item.amount || 0) }}</span></p>
                    <p>{{mealTypeEnum[item.type]}}</p>
                </li>
            </ul>
        </ng-container>

        <ng-template #addMealModal>
            <oww-add-meal [meal]="mealToEdit" (mealChange)="saveMeal($event)" />
        </ng-template>
    `,
    styles: [`
        ul {
            border: 3px solid black;
            width: fit-content;
            padding: 10px;
            margin-bottom: 10px;
            
            > li {
                width: fit-content;
                padding: 10px; 
            }
        }
    `],
    standalone: true,
    imports: [
        NgFor,
        AsyncPipe,
        AddMealComponent,
        DatePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyOverviewComponent {
    readonly mealTypeEnum = MealItemType;
    readonly today: Date = new Date();

    protected mealToEdit!: Meal | undefined;

    protected freeFruitItems: Set<MealItem> = new Set<MealItem>();
    protected freeProteinItem: MealItem | undefined;

    protected dailyMeals$: Observable<Meal[]>;

    constructor(private readonly dialogService: DialogService, public mealsService: MealsService, private readonly store: Store<AppState>) {
        this.mealsService.todaysFreeFruitItems$.pipe(takeUntilDestroyed()).subscribe(freeFruitItems => this.freeFruitItems = freeFruitItems);
        this.mealsService.todaysFreeProteinItem$.pipe(takeUntilDestroyed()).subscribe(freeProteinItem => this.freeProteinItem = freeProteinItem);

        this.dailyMeals$ = this.store.select(selectDailyMeals);
    }

    addMeal(dialogTemplate: TemplateRef<unknown>) {
        this.dialogService.showModal(dialogTemplate);
    }

    saveMeal(meal: Meal) {
        const mealToEdit = this.mealToEdit;
        this.dialogService.closeModal();

        if (!meal) {
            return;
        }

        if (mealToEdit) {
            // TODO SASHA: LOOKS LIKE THERE'S A BUG AND THIS DOESN'T WORK (IT APPEARS TO CREATE A DUPLICATE OF THE MEAL INSTEAD OF PREPLACING IT)
            this.mealsService.replaceMeal(meal);
        } else {
            // TODO sasha: add proper way of naming a meal.
            meal.name = Math.random() + "";

            this.mealsService.addMeal(meal);
        }
    }

    editMeal(meal: Meal, dialogTemplate: TemplateRef<unknown>) {
        this.mealToEdit = meal;

        this.dialogService.showModal(dialogTemplate);
        this.dialogService.close$.pipe(take(1)).subscribe(() => this.mealToEdit = undefined);
    }

    deleteMeal(meal: Meal) {
        this.mealsService.deleteMeal(meal);
    }
} 
