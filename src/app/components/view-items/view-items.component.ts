import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MealItemDescription } from "src/app/models/meal-item-description";
import { DialogService } from "src/app/services/dialog.service";

import { ItemsService } from "src/app/services/items.service";
import { CreateItemComponent } from "../create-item/create-item.component";

@Component({
    selector: "oww-view-items",
    template: `
        <h2>All Items</h2>
        <button (click)="beginItemCreation()">Create Item</button>
        <ul>
            <!-- todo sasha: add virtual scrolling -->
            <li *ngFor="let item of itemsService.itemDescriptions$ | async">
                {{item.name}}
                {{item.type}}
                {{item.points}}
            </li>
        </ul>

        <ng-template #createItem>
            <oww-create-item (item)="onItemCreated($event)" />
        </ng-template>

        <ng-template #nameItem>
            Please select a name for the new item: <input [(ngModel)]="itemName">
            <button (click)="onItemNamed()">Save new Item</button><button (click)="cancel()">Cancel</button>
        </ng-template>
    `,
    standalone: true,
    imports: [NgFor, FormsModule, AsyncPipe, CreateItemComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewItemsComponent {
    @ViewChild("createItem")
    protected createItemTemplate!: TemplateRef<unknown>;

    @ViewChild("nameItem")
    protected nameItemTemplate!: TemplateRef<unknown>;

    protected itemName = "";
    private createdItem!: MealItemDescription;

    constructor(protected itemsService: ItemsService, private dialogService: DialogService) {}

    beginItemCreation() {
        if (!this.createItemTemplate) {
            return;
        }

        this.dialogService.showModal(this.createItemTemplate);
    }

    onItemCreated(item: MealItemDescription) {
        if (!item || !this.nameItemTemplate) {
            this.dialogService.closeModal();

            return;
        }

        this.createdItem = item;

        this.dialogService.showModal(this.nameItemTemplate);
    }

    onItemNamed() {
        if (!this.createdItem) {
            return;
        }

        this.createdItem.name = this.itemName;

        this.itemsService.createItem(this.createdItem);

        this.dialogService.closeModal();
    }

    cancel() {
        this.dialogService.closeModal();
    }
}