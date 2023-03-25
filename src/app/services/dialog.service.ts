import { Injectable, TemplateRef } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class DialogService {
    private readonly closeSubject: Subject<void> = new Subject();
    private readonly showSubject: Subject<TemplateRef<unknown>> = new Subject();

    readonly close$ = this.closeSubject.asObservable();
    readonly show$ = this.showSubject.asObservable();

    closeModal() {
        this.closeSubject.next();
    }

    showModal(template: TemplateRef<unknown>) {
        this.showSubject.next(template);
    }
}