import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
        <!-- toto sasha: make add-item a component! -->
        <div class="add-item">
            <input list="items-to-add" [(ngModel)]="selectedItemName">

            <datalist id="items-to-add">
                <option *ngFor="let option of itemsService.itemDescriptions" [value]="option.name" [ngValue]="option">
                         {{option.points}}
                </option>
            </datalist>

            {{selectedItem?.points ? selectedItem?.points + ' X ' : ''}} 
            <input type="number" [(ngModel)]="itemAmount" [min]="0" #amount (change)="amount.value = +amount.value < 0 ? '0' : amount.value">
            =  {{(selectedItem?.points || 0) * +amount.value}}
            <div>
                <button [disabled]="!selectedItem || !amount.value" (click)="addItem(+amount.value)">Add</button>
            </div>
        </div>
        <p>This meal is worth {{ calculatedPoints }} points.</p>
        <button [disabled]="!items.length" (click)="saveMeal()">Save</button>
        <button (click)="cancel()">Cancel</button>
    `,
    styles: [`
        .free-item { 
            text-decoration-line: line-through;
        }
    `],
    standalone: true,
    imports: [NgFor, AsyncPipe, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMealComponent implements OnInit {
    @Output()
    readonly mealChange = new EventEmitter<Meal>();

    @Input()
    meal!: Meal | undefined;

    protected itemAmount: number | undefined = 0;

    protected set selectedItemName(value: string | undefined) {
        this._selectedItemName = value;

        this.selectedItem = this.itemsService.itemDescriptions.find(i => i.name === this.selectedItemName);
    }

    protected get selectedItemName() {
        return this._selectedItemName;
    }

    private _selectedItemName: string | undefined = "";

    protected selectedItem: MealItemDescription | undefined;

    protected set items(value: MealItem[]) {
        this._items = value;

        this.freeItemIndexes.clear();

        let todaysFruitAmount = this.todaysFruitAmount;
        let usedFreeProteinToday = this.usedFreeProteinToday;

        this.calculatedPoints = this.items.reduce((total, curr, index) => {
            let amountToAdd = curr.amount * curr.points;

            // todo sasha: this logic is repeated twice - here and in the meals service. There needs to be a way to consolidate them.
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

    constructor(private mealsService: MealsService, protected itemsService: ItemsService) {
        this.mealsService.allowedDailyPoints$.pipe(take(1)).subscribe(allowedDailyPoints => this.allowedDailyPoints = allowedDailyPoints);
        this.mealsService.dailyPoints$.pipe(take(1)).subscribe(dailyPoints => this.startingPoints = dailyPoints);
        this.mealsService.usedFreeProteinToday$.pipe(take(1)).subscribe(usedFreeProteinToday => this.usedFreeProteinToday = usedFreeProteinToday);
        this.mealsService.todaysFruitAmount$.pipe(take(1)).subscribe(todaysFruitAmount => this.todaysFruitAmount = todaysFruitAmount);
    }

    ngOnInit(): void {
        if (this.meal) {
            this.items = structuredClone(this.meal.items);
        }
    }

    protected addItem(amount: number) {
        if (!this.selectedItem) {
            return;
        }

        this.items = [...this.items, { ...this.selectedItem, amount }];
        this.selectedItemName = undefined;
        this.itemAmount = undefined;
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