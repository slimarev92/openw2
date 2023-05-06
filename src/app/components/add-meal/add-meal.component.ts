import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { take } from "rxjs";

import { Meal } from "src/app/models/meal";
import { MealItem } from "src/app/models/meal-item";
import { ItemsService } from "src/app/services/items.service";
import { MealsService } from "src/app/services/meals.service";
import { AddItemComponent } from "src/app/components/add-item/add-item.component";
import { calculatePointsAndData as calculatePointsAndFreeItems } from "src/app/utils/utils";

@Component({
    selector: "oww-add-meal",
    template: `
        <ul>
            <li *ngFor="let item of items; let i = index">
                {{item.name}}: {{item.points}} x {{item.amount}} = <span [class.free-item]="freeItemsEnabled && freeItemIndexes.has(i)">{{item.amount * item.points}}</span>
                <button (click)="removeItem(i)">X</button>
            </li>
        </ul>

        <oww-add-item (item)="addItem($event)" />

        <p i18n>This meal is worth {{ calculatedPoints }} points.</p>
        <button [disabled]="!items.length" (click)="saveMeal()" i18n>Save</button>
        <button (click)="cancel()" i18n>Cancel</button>
    `,
    standalone: true,
    imports: [NgFor, AsyncPipe, FormsModule, AddItemComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMealComponent implements OnInit {
    @Output()
    readonly mealChange = new EventEmitter<Meal>();

    @Input()
    public meal!: Meal | undefined;

    @Input()
    public freeItemsEnabled = true;

    protected set items(value: MealItem[]) {
        this._items = value;

        const startingFruitAmount = this.freeItemsEnabled ? this.todaysFruitAmount : 3;
        const usedFreeProteinToday = this.freeItemsEnabled && this.usedFreeProteinToday;

        const [totalPoints, freeItemIndexes] = calculatePointsAndFreeItems(this.items, startingFruitAmount, usedFreeProteinToday);

        this.calculatedPoints = totalPoints;
        this.freeItemIndexes = freeItemIndexes;
    }

    protected get items() {
        return this._items;
    }

    private _items: MealItem[] = [];

    protected startingPoints = 0;
    protected allowedDailyPoints = 0;
    protected usedFreeProteinToday = false;
    protected todaysFruitAmount = 0;
    protected calculatedPoints = 0;
    protected freeItemIndexes = new Set<number>();

    constructor(private mealsService: MealsService, protected itemsService: ItemsService) {
        this.mealsService.allowedDailyPoints$.pipe(take(1)).subscribe(allowedDailyPoints => this.allowedDailyPoints = allowedDailyPoints);
        this.mealsService.dailyPoints$.pipe(take(1)).subscribe(dailyPoints => this.startingPoints = dailyPoints);
        this.mealsService.todaysFreeProteinItem$.pipe(take(1)).subscribe(freeItem => this.usedFreeProteinToday = !!freeItem);
        this.mealsService.todaysFreeFruitItems$.pipe(take(1)).subscribe(freeItems => this.todaysFruitAmount = freeItems.size);
    }

    ngOnInit(): void {
        if (this.meal) {
            this.items = structuredClone(this.meal.items);
        }
    }

    protected addItem(item: MealItem) {
        if (!item) {
            return;
        }

        this.items = [...this.items, item];
    }

    protected saveMeal() {
        const meal: Meal = {
            name: "",
            time: new Date(),
            items: this.items
        };

        this.mealChange.emit(meal);
    }

    protected cancel() {
        this.mealChange.emit(undefined);
    }

    protected removeItem(itemIndex: number) {
        this.items.splice(itemIndex, 1);

        this.items = [...this.items];
    }
}