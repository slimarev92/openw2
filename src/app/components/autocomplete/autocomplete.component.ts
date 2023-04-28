import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { EMPTY, Observable } from "rxjs";

export type HasItemText = {
    itemText: string
};

@Component({
    selector: "oww-autocomplete",
    styles: [`
        .autocomplete-container {
            position: relative;

            > input, ul {
                width: 100%;
            }

            > input {
                box-sizing: border-box;
            }

            > .clear {
                position: absolute;
                right: 0.1rem;
                margin: 0.2rem;
                font-size: 0.9rem;
            }

            > .options-container {
                max-height: 5rem;
                overflow-y: auto;
                overflow-x: hidden;
                position: absolute;
                top: 100%;
                background: lavender;

                li:hover {
                    background: white;
                }
            }
        }
    `],
    template: `
        <div class="autocomplete-container">
            <input [style.width]="containerWidth" [disabled]="disabled" (input)="onInput($event)" (blur)="onInputBlur()" (focus)="onInputFocus()" [value]="selectedItemText" type="text">
            <button *ngIf="selectedItemText" class="clear plain-button" (click)="onSelectItem()">X</button>

            <ng-container *ngIf="autoCompleteItems$ | async as autocompleteItems">
                <ul *ngIf="optionsExpanded" class="options-container">
                    <li *ngFor="let item of autocompleteItems" (click)="onSelectItem(item)">
                        {{item.itemText}}
                    </li>
                </ul>
            </ng-container>

        </div>
    `,
    imports: [NgForOf, NgIf, AsyncPipe],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutoCompleteComponent),
            multi: true
        }
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteComponent implements ControlValueAccessor {
    @Input()
    public autoCompleteItems$: Observable<HasItemText[]> = EMPTY;

    @Input()
    public containerWidth = "10rem";

    @Output()
    public enteredText = new EventEmitter<string>();

    private _selectedItemText = "";

    protected get selectedItemText() {
        return this._selectedItemText;
    }

    protected set selectedItemText(value) {
        this._selectedItemText = value;

        this.enteredText.emit(value);
    }

    protected optionsExpanded = false;
    protected disabled = false;

    private outsideOnChange = (_: unknown) => void _;

    constructor(private changeDetector: ChangeDetectorRef) { }

    protected onInput($event: Event) {
        const value = ($event.target as HTMLInputElement).value;

        this.selectedItemText = value;
        this.enteredText.emit(this.selectedItemText);
    }
    
    protected onSelectItem(item?: HasItemText) {
        this.selectedItemText = item?.itemText || "";

        this.outsideOnChange(item);
        this.optionsExpanded = false;
    }

    protected onInputBlur() {
        setTimeout(() => {
            this.optionsExpanded = false;
            this.changeDetector.markForCheck();
        }, 
        // TODO SASHA: MAKE THIS LESS JANKY (RELYING ON ARBITRARY TIMEOUT TO ALLOW SELECTION TO OCCUR, ONLY THEN TO HIDE OPTIONS)
        100);
    }

    protected onInputFocus() {
        setTimeout(() => {
            this.optionsExpanded = true;
            this.changeDetector.markForCheck();
        }, 
        // TODO SASHA: MAKE THIS LESS JANKY (RELYING ON ARBITRARY TIMEOUT TO ALLOW SELECTION TO OCCUR, ONLY THEN TO HIDE OPTIONS)
        100);
    }

    writeValue(value: HasItemText): void {
        this.selectedItemText = value?.itemText || "";
    }

    registerOnChange(fn: (item: unknown) => undefined): void {
        this.outsideOnChange = fn;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    registerOnTouched() { }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }
}