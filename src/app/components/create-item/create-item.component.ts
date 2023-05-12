import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { Meal } from "src/app/models/meal";
import { MealItemDescription } from "src/app/models/meal-item-description";
import { MealItemType } from "src/app/models/meal-type";
import { AddMealComponent } from "../add-meal/add-meal.component";

@Component({
    selector: "oww-create-item",
    template: `
        <oww-add-meal [freeItemsEnabled]="false" (mealChange)="itemCreated($event)" />
    `,
    standalone: true,
    imports: [AddMealComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItemComponent {
    @Output()
    public readonly item = new EventEmitter<MealItemDescription>();

    itemCreated(itemAsMeal: Meal) {
        if (!itemAsMeal) {
            this.item.emit(itemAsMeal);

            return;
        }

        const points = itemAsMeal.items.reduce((total, curr) => total + curr.points, 0);
        const type = MealItemType.Regular;

        const createdItem: MealItemDescription = {
            canonicalName: "",
            name: "",
            points,
            type
        };

        this.item.emit(createdItem);
    }
}