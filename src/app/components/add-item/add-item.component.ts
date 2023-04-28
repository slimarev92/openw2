import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MealItem } from "src/app/models/meal-item";

import { MealItemDescription } from "src/app/models/meal-item-description";
import { ItemsService } from "src/app/services/items.service";
import { AutoCompleteComponent, HasItemText } from "../autocomplete/autocomplete.component";
import { Subject, combineLatest, map } from "rxjs";

@Component({
    selector: "oww-add-item",
    styles: [`
        // TODO SASHA: FIND A MORE DRY WAY TO DO THIS?
        input {
            width: 100%;
            box-sizing: border-box;
        }
    `],
    template: `
        <div class="input-container">
            <oww-autocomplete containerWidth="100%" [(ngModel)]="selectedItem" [autoCompleteItems$]="filteredDescriptions$" (enteredText)="enteredTextSubject.next($event)"></oww-autocomplete>
            <input type="number" [(ngModel)]="itemAmount" [min]="0" #amount (change)="amount.value = +amount.value < 0 ? '0' : amount.value">
        </div>

        =  {{(selectedItem?.points || 0) * +amount.value}}
        <div>
            <button [disabled]="!selectedItem || !amount.value" (click)="addItem(+amount.value)">Add</button>
        </div>
    `,
    imports: [NgFor, FormsModule, AsyncPipe, AutoCompleteComponent],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddItemComponent {
    private autoCompleteItemsSubject = new Subject<HasItemText[]>();

    protected autoCompleteItems$ = this.autoCompleteItemsSubject.asObservable();

    protected selectedItem: MealItemDescription | undefined;

    protected itemAmount: number | undefined = 0;

    protected enteredTextSubject = new Subject<string>();

    protected filteredDescriptions$ = combineLatest([this.enteredTextSubject.pipe(map(text => text.toLowerCase())), this.itemsService.itemDescriptions$]).pipe(
        // TODO SASHA: make this more performant and possible better formatted?
        map(
            ([filterText, items]) => items.filter(i => i.name.toLowerCase().startsWith(filterText)).map(i => ({itemText: `${i.name} (${i.points})`, ...i}))
        )
    );
    
    @Output()
    public readonly item = new EventEmitter<MealItem>();

    constructor(protected itemsService: ItemsService) { }

    protected addItem(amount: number) {
        if (!this.selectedItem) {
            return;
        }

        this.item.emit({...this.selectedItem , amount});

        this.selectedItem = undefined;
        this.itemAmount = undefined;
    }
}