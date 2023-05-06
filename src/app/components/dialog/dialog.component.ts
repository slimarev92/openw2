import { CommonModule } from "@angular/common";
import { Component, ElementRef, TemplateRef, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DialogService } from "src/app/services/dialog.service";

@Component({
    selector: "oww-dialog",
    template: `
        <dialog #dialog (close)="dialogService.closeModal()">
            <ng-container *ngTemplateOutlet="templateToShow || blank"></ng-container>
        </dialog>
        <ng-template #blank></ng-template>
    `,
    styles: [
        `dialog {
            border: none;
            
            &::backdrop {
                background-color: rgba(0, 0, 0, 0.6);
            }
         }`
    ],
    standalone: true,
    imports: [CommonModule]
})
export class DialogComponent {
    public templateToShow: TemplateRef<unknown> | undefined;

    @ViewChild("dialog", { read: ElementRef })
    protected dialogElement!: ElementRef<HTMLDialogElement>;

    constructor(protected dialogService: DialogService) {
        this.dialogService.show$.pipe(takeUntilDestroyed()).subscribe(template => { 
            this.templateToShow = template; 

            if (!this.dialogElement.nativeElement.open) {
                this.dialogElement?.nativeElement.showModal();
            }
        });

        this.dialogService.close$.pipe(takeUntilDestroyed()).subscribe(() => {
            // TODO SASHA: WHEN THE DIALOG CLOSES PROGRAMATICALLY, CLOSE$ EMITS TWICE (THE SECOND TIME IS FROM THE DIALOG ELEMENT'S CLOSE EVENT). FIND A BETTER WAY.

            this.templateToShow = undefined;
            this.dialogElement?.nativeElement.close();
        });
    }
}