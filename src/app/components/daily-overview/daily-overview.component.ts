
import { CommonModule } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { Meal } from "src/app/models/meal";
import { MealItemType } from "src/app/models/meal-type";
import { DialogService } from "src/app/services/dialog.service";
import { AddItemComponent } from "src/app/components/add-item/add-item.component";

@Component({
    selector: "oww-daily-overview",
    templateUrl: "./daily-overview.component.html",
    styleUrls: ["./daily-overview.component.scss"],
    standalone: true,
    imports: [
        CommonModule,
        AddItemComponent
    ]
})
export class DailyOverviewComponent {
    readonly mealTypeEnum = MealItemType;
    readonly today: Date = new Date();

    dailyMeals: Meal[] = [
        {
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

    @ViewChild("moshe")
    dialogTemplate!: TemplateRef<any>;

    constructor(private dialogService: DialogService) {
        
    }

    show() {
        if (!this.dialogTemplate) {
            return;
        }

        this.dialogService.showModal(this.dialogTemplate);
    }

    hide() {
        this.dialogService.closeModal();
    }
} 
