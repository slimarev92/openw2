import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MealItem } from "src/app/models/meal-item";

import { MealItemDescription } from "src/app/models/meal-item-description";
import { ItemsService } from "src/app/services/items.service";

@Component({
    selector: "oww-add-item",
    template: `
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
    `,
    imports: [NgFor, FormsModule],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddItemComponent {
    protected set selectedItemName(value: string | undefined) {
        this._selectedItemName = value;

        this.selectedItem = this.itemsService.itemDescriptions.find(i => i.name === this.selectedItemName);
    }

    protected get selectedItemName() {
        return this._selectedItemName;
    }

    private _selectedItemName: string | undefined = "";

    protected selectedItem: MealItemDescription | undefined;

    protected itemAmount: number | undefined = 0;

    @Output()
    public readonly item = new EventEmitter<MealItem>();

    constructor(protected itemsService: ItemsService) { }

    protected addItem(amount: number) {
        if (!this.selectedItem) {
            return;
        }

        this.item.emit({...this.selectedItem , amount});

        this.selectedItemName = undefined;
        this.itemAmount = undefined;
    }
}