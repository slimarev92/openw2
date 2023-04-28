import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { DailyOverviewComponent } from "./components/daily-overview/daily-overview.component";
import { DialogComponent } from "./components/dialog/dialog.component";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { AppLanguageService } from "./services/app-language.service";

@Component({
    selector: "app-root",
    template: `
        <div [dir]="appDirection">
            <oww-nav-bar></oww-nav-bar>
            <router-outlet></router-outlet>
            <oww-dialog></oww-dialog>
        </div>
    `,
    styleUrls: ["./app.component.scss"],
    standalone: true,
    imports: [RouterOutlet, DailyOverviewComponent, DialogComponent, NavBarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent { 
    protected appDirection = inject(AppLanguageService).getAppTextDirection();
}
