import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MealItemDescription } from "src/app/models/meal-item-description";
import { DialogService } from "src/app/services/dialog.service";

import { ItemsService } from "src/app/services/items.service";
import { CreateItemComponent } from "../create-item/create-item.component";

@Component({
    selector: "oww-view-items",
    template: `
        <h2 i18n>All Items</h2>
        <button (click)="beginItemCreation(createItem)" i18n>Create Item</button>
        <ul>
            <!-- todo sasha: add virtual scrolling -->
            <li *ngFor="let item of itemsService.itemDescriptions$ | async">
                {{item.name}}
                {{item.type}}
                {{item.points}}
            </li>
        </ul>

        <ng-template #createItem>
            <oww-create-item (item)="onItemCreated(nameItem, $event)" />
        </ng-template>

        <ng-template #nameItem>
            <span i18n>Please select a name for the new item:</span> <input [(ngModel)]="itemName">
            <button (click)="onItemNamed()" i18n>Save new Item</button><button (click)="cancel()" i18n>Cancel</button>
        </ng-template>
    `,
    standalone: true,
    imports: [NgFor, FormsModule, AsyncPipe, CreateItemComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewItemsComponent {
    protected itemName = "";
    private createdItem!: MealItemDescription;

    constructor(protected itemsService: ItemsService, private readonly dialogService: DialogService) {}

    beginItemCreation(createItemTemplate: TemplateRef<unknown>) {
        this.dialogService.showModal(createItemTemplate);
    }

    onItemCreated(nameItemTemplate: TemplateRef<unknown>, item?: MealItemDescription) {
        if (!item) {
            this.dialogService.closeModal();

            return;
        }

        this.createdItem = item;

        this.dialogService.showModal(nameItemTemplate);
    }

    onItemNamed() {
        if (!this.createdItem) {
            return;
        }

        this.createdItem.name = this.itemName;
        this.createdItem.canonicalName = this.itemName;

        this.itemsService.createItem(this.createdItem);

        this.dialogService.closeModal();
    }

    cancel() {
        this.dialogService.closeModal();
    }
}