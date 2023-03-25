import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnDestroy, TemplateRef, ViewChild } from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";
import { DialogService } from "src/app/services/dialog.service";

@Component({
    selector: "oww-dialog",
    template: `
        <dialog #dialog>
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
export class DialogComponent implements AfterViewInit, OnDestroy {
    private readonly destroyed: Subject<void> = new Subject();

    public templateToShow: TemplateRef<unknown> | undefined;

    @ViewChild("dialog", { read: ElementRef })
    protected dialogElement!: ElementRef<HTMLDialogElement>;

    constructor(private dialogService: DialogService) {
        this.dialogService.show$.pipe(takeUntil(this.destroyed)).subscribe(template => { 
            this.templateToShow = template; 

            if (!this.dialogElement.nativeElement.open) {
                this.dialogElement?.nativeElement.showModal();
            }
        });

        this.dialogService.close$.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.templateToShow = undefined;
            this.dialogElement?.nativeElement.close();
        });
    }

    ngAfterViewInit(): void {
        fromEvent(this.dialogElement.nativeElement, "close").pipe(takeUntil(this.destroyed)).subscribe(() => this.dialogService.closeModal());
    }

    ngOnDestroy(): void {
        this.destroyed.next();
    }
}