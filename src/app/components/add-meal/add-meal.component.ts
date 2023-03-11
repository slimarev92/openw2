import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { take } from "rxjs";
import { Meal } from "src/app/models/meal";
import { MealItem } from "src/app/models/meal-item";
import { MealItemDescription } from "src/app/models/meal-item-description";
import { MealItemType } from "src/app/models/meal-type";
import { ItemsService } from "src/app/services/items.service";
import { MealsService } from "src/app/services/meals.service";

@Component({
    selector: "oww-add-meal",
    template: `
        <ul>
            <li *ngFor="let item of items; let i = index">
                {{item.name}}: {{item.points}} x {{item.amount}} = <span [class.free-item]="freeItemIndexes.has(i)">{{item.amount * item.points}}</span>
                <button (click)="removeItem(i)">X</button>
            </li>
        </ul>
        <div>
            <input list="items-to-add" [(ngModel)]="selectedItemName" (change)="selectedItemChanged()">

            <datalist id="items-to-add">
                <option *ngFor="let option of itemsService.itemDescriptions" [value]="option.name" [ngValue]="option">
                         {{option.points}}
                </option>
            </datalist>

            {{selectedItem?.points}}
            <input type="number" [min]="0" #amount>
            <button (click)="addItem(+amount.value)">Add</button>
        </div>
        <p>This meal is worth {{ calculatedPoints }} points.
        <button (click)="saveMeal()">Save</button>
    `,
    imports: [NgFor, AsyncPipe, FormsModule],
    standalone: true,
    styles: [`
                .free-item { 
                    text-decoration-line: line-through;
                }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMealComponent {
    @Output()
    meal = new EventEmitter<Meal>();

    protected selectedItemName: string = "";

    protected selectedItem: MealItemDescription | undefined;

    protected set items(value: MealItem[]) {
        this._items = value;

        this.freeItemIndexes.clear();

        let todaysFruitAmount = this.todaysFruitAmount;
        let usedFreeProteinToday = this.usedFreeProteinToday;

        this.calculatedPoints = this.items.reduce((total, curr, index) => {
            let amountToAdd = curr.amount * curr.points;

            if (curr.type === MealItemType.Fruit && todaysFruitAmount < 3) {
                amountToAdd = 0;
                todaysFruitAmount++;
                this.freeItemIndexes.add(index);
            } else if (curr.type === MealItemType.Protein && !usedFreeProteinToday) {
                usedFreeProteinToday = true;
                this.freeItemIndexes.add(index);
                amountToAdd = 0;
            }

            return total + amountToAdd;
        }, 0);
           
    };

    protected get items() { 
        return this._items;
    }

    private _items: MealItem[] = [];

    protected startingPoints: number = 0;
    protected allowedDailyPoints: number = 0;
    protected usedFreeProteinToday: boolean = false;
    protected todaysFruitAmount: number = 0;
    protected calculatedPoints: number = 0;
    protected readonly freeItemIndexes = new Set<number>();

    private readonly mealsService = inject(MealsService);
    protected readonly itemsService = inject(ItemsService);

    constructor() {
        this.mealsService.allowedDailyPoints$.pipe(take(1)).subscribe(allowedDailyPoints => this.allowedDailyPoints = allowedDailyPoints);
        this.mealsService.dailyPoints$.pipe(take(1)).subscribe(dailyPoints => this.startingPoints = dailyPoints);
        this.mealsService.usedFreeProteinToday$.pipe(take(1)).subscribe(usedFreeProteinToday => this.usedFreeProteinToday = usedFreeProteinToday);
        this.mealsService.todaysFruitAmount$.pipe(take(1)).subscribe(todaysFruitAmount => this.todaysFruitAmount = todaysFruitAmount);
    }

    protected addItem(amount: number) {
        if (!this.selectedItem) {
            return;
        }

        this.items = [...this.items, { ...this.selectedItem, amount }];
    }

    protected saveMeal() {
        const meal: Meal = {
            name: "",
            time: new Date(),
            items: this.items
        };

        this.meal.emit(meal);
    }

    protected selectedItemChanged() {
        this.selectedItem = this.itemsService.itemDescriptions.find(i => i.name === this.selectedItemName);
    }

    protected removeItem(itemIndex: number) {
        this.items.splice(itemIndex, 1);

        this.items = [...this.items];
    }
}