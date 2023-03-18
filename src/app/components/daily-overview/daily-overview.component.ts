
import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from "@angular/core";
import { Meal } from "src/app/models/meal";
import { MealItemType } from "src/app/models/meal-type";
import { DialogService } from "src/app/services/dialog.service";
import { AddMealComponent } from "src/app/components/add-meal/add-meal.component";
import { MealsService } from "src/app/services/meals.service";
import { take } from "rxjs";

@Component({
    selector: "oww-daily-overview",
    template: `
        <h2>Today's Overview - {{today.toLocaleDateString('en-gb')}} - {{mealsService.dailyPoints$ | async}} Points</h2>
        <button (click)="addMeal()">Add Meal</button>

        <ng-container *ngFor="let meal of mealsService.dailyMeals$ | async; let i = index">
            <!-- todo sasha: why to local timestring en-gb? use browser locale instead -->
            <h3>{{ i + 1}}: {{ meal.time.toLocaleTimeString('en-gb') }} <button (click)="editMeal(meal)">E</button><button (click)="deleteMeal(meal)">X</button></h3>
            <ul>
                <li *ngFor="let item of meal.items">
                    <h4>{{item.name}}</h4>
                    <p>{{item.points}} x {{ item.amount }} = {{ (item.points || 0) * (item.amount || 0) }}</p>
                    <p>{{mealTypeEnum[item.type]}}</p>
                </li>
            </ul>
        </ng-container>

        <ng-template #addMealModal>
            <oww-add-meal [meal]="mealToEdit" (mealChange)="saveMeal($event)"></oww-add-meal>
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
        AddMealComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyOverviewComponent {
    readonly mealTypeEnum = MealItemType;
    readonly today: Date = new Date();

    @ViewChild("addMealModal")
    dialogTemplate!: TemplateRef<any>;

    protected mealToEdit!: Meal | undefined;

    constructor(private dialogService: DialogService, public mealsService: MealsService) {
        
    }

    addMeal() {
        if (!this.dialogTemplate) {
            return;
        }

        this.dialogService.showModal(this.dialogTemplate);
    }

    saveMeal(meal: Meal) {
        const mealToEdit = this.mealToEdit;
        this.dialogService.closeModal();

        if (!meal) {
            return;
        }

        if (mealToEdit) {
            this.mealsService.replaceMeal(mealToEdit, meal);
        } else {
            this.mealsService.addMeal(meal);
        }
    }

    editMeal(meal: Meal) {
        this.mealToEdit = meal;

        this.dialogService.showModal(this.dialogTemplate);
        this.dialogService.close$.pipe(take(1)).subscribe(() => this.mealToEdit = undefined);
    }

    deleteMeal(meal: Meal) {
        this.mealsService.deleteMeal(meal);
    }
} 
