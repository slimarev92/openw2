import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { AppComponent } from "./app/app.component";

import { APP_ROUTES } from "./app/routes/routes";
import { LOCALE_ID } from "@angular/core";
import { registerLocaleData } from "@angular/common";

// TODO SASHA: THIS IS A BIT CLUNKLY, BUT APPARENTLY THERE ISNT REALLY A BETTER WAY. COULD BE CLEANED UP A LITTLE.
async function registerLocale() {
    const languageId = /([a-z,A-Z]+)/.exec(navigator.language)?.[0];

    if (languageId === "fr") {
        const frLocale = await import("@angular/common/locales/fr");

        registerLocaleData(frLocale.default);
    } else if (languageId === "en") {
        const enLocale = await import("@angular/common/locales/en");

        registerLocaleData(enLocale.default);
    } else if (languageId === "he") {
        const heLocale = await import("@angular/common/locales/he");

        registerLocaleData(heLocale.default);
    } else if (languageId === "ar") {
        const heLocale = await import("@angular/common/locales/ar");

        registerLocaleData(heLocale.default);
    }

    return languageId;
}

async function bootstrap() {
    const localeId = await registerLocale();

    bootstrapApplication(AppComponent,
        {
            providers: [
                {provide: LOCALE_ID, useValue: localeId },
                provideRouter(APP_ROUTES)
            ]
        });
}


bootstrap();