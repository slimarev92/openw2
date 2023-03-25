import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

import { ItemsService } from "src/app/services/items.service";

@Component({
    selector: "oww-view-items",
    template: `
        <h2>All Items</h2>
        <ul>
            <!-- todo sasha: add virtual scrolling -->
            <li *ngFor="let item of itemsService.itemDescriptions$ | async">
                {{item.name}}
                {{item.type}}
                {{item.points}}
            </li>
        </ul>
    `,
    standalone: true,
    imports: [NgFor, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewItemsComponent {
    constructor(protected itemsService: ItemsService) {}
}