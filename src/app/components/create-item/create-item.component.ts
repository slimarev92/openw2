import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Meal } from "src/app/models/meal";
import { MealItem } from "src/app/models/meal-item";
import { MealItemDescription } from "src/app/models/meal-item-description";
import { MealItemType } from "src/app/models/meal-type";
import { ItemsService } from "src/app/services/items.service";
import { calculatePointsAndData } from "src/app/utils/utils";
import { AddMealComponent } from "../add-meal/add-meal.component";

@Component({
    selector: "oww-create-item",
    template: `
        <oww-add-meal (mealChange)="itemCreated($event)"></oww-add-meal>
    `,
    standalone: true,
    imports: [AddMealComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItemComponent {
    itemCreated(itemAsMeal: Meal) {
        const points = itemAsMeal.items.reduce((total, curr) => total + curr.points, 0);
        const name = "moshe";
        const type = MealItemType.Regular;

        const createdItem: MealItemDescription = {
            name,
            points,
            type
        };

        this.itemsService.createItem(createdItem);
    }

    constructor(private itemsService: ItemsService) {}
}