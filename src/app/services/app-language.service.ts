import { Injectable,LOCALE_ID, inject } from "@angular/core";

const SUPPORTED_RTL_LOCALES_SET = new Set(["ar", "he"]);

@Injectable({providedIn: "root"})
export class AppLanguageService {
    private localeId = inject(LOCALE_ID);

    // TODO SASHA: THIS CAN BE A DI TOKEN WITH A FACTORY INSTEAD.
    public getAppTextDirection() {
        return SUPPORTED_RTL_LOCALES_SET.has(this.localeId) ? "rtl" : "ltr";
    }
}