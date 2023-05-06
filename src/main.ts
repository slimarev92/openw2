import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { LOCALE_ID } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import "@angular/localize/init";
import { loadTranslations } from "@angular/localize";

import { AppComponent } from "./app/app.component";
import { APP_ROUTES } from "./app/routes/routes";

// TODO SASHA: THIS IS A BIT CLUNKLY, BUT APPARENTLY THERE ISNT REALLY A BETTER WAY. COULD BE CLEANED UP A LITTLE.
async function registerLocale() {
    const languageId = /([a-z,A-Z]+)/.exec(navigator.language)?.[0];

    if (languageId === "he") {
        const heLocale = await import("@angular/common/locales/he");
    
        registerLocaleData(heLocale.default);
    } else {
        const enLocale = await import("@angular/common/locales/en");

        registerLocaleData(enLocale.default);
    }

    const translations = (await import(`./locale/messages.${languageId}.json`)).default.translations;

    loadTranslations(translations);

    return languageId;
}

async function bootstrap() {
    const localeId = await registerLocale();

    bootstrapApplication(AppComponent,
        {
            providers: [
                {
                    provide: LOCALE_ID, 
                    useValue: localeId 
                },
                provideRouter(APP_ROUTES)
            ]
        });
}

bootstrap();