import { Component, Input } from "@angular/core";

@Component({
    selector: "oww-add-item",
    template: `{{name}}`,
    standalone: true
})
export class AddItemComponent {
    @Input()
    name: string = "";
}