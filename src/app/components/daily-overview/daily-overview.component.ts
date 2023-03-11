
import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from "@angular/core";
import { Meal } from "src/app/models/meal";
import { MealItemType } from "src/app/models/meal-type";
import { DialogService } from "src/app/services/dialog.service";
import { AddMealComponent } from "src/app/components/add-meal/add-meal.component";
import { MealsService } from "src/app/services/meals.service";

@Component({
    selector: "oww-daily-overview",
    template: `
        <h2>Today's Overview - {{today.toLocaleDateString('en-gb')}} - {{mealsService.dailyPoints$ | async}} Points</h2>
        <button (click)="showAddModal()">Add Meal</button>

        <ng-container *ngFor="let meal of mealsService.dailyMeals$ | async; let i = index">
            <!-- todo sasha: why to local timestring en-gb? use browser locale instead -->
            <h3>{{ i + 1}}: {{ meal.time.toLocaleTimeString('en-gb') }}</h3>
            <ul>
                <li *ngFor="let item of meal.items">
                    <h3>{{item.name}}</h3>
                    <p>{{item.points}} x {{ item.amount }} = {{ (item.points || 0) * (item.amount || 0) }}</p>
                    <p>{{mealTypeEnum[item.type]}}</p>
                </li>
            </ul>
        </ng-container>

        <ng-template #addMealModal>
            <oww-add-meal (meal)="saveMeal($event)"></oww-add-meal>
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

    constructor(private dialogService: DialogService, public mealsService: MealsService) {
        
    }

    showAddModal() {
        if (!this.dialogTemplate) {
            return;
        }

        this.dialogService.showModal(this.dialogTemplate);
    }

    saveMeal(meal: Meal) {
        this.dialogService.closeModal();
        
        if (meal) {
            this.mealsService.addMeal(meal);
        }
    }
} 
