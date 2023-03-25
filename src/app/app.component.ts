import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { DailyOverviewComponent } from "./components/daily-overview/daily-overview.component";
import { DialogComponent } from "./components/dialog/dialog.component";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";


@Component({
    selector: "app-root",
    template: `
      <oww-nav-bar></oww-nav-bar>

      <router-outlet></router-outlet>

      <oww-dialog></oww-dialog>
    `,
    styleUrls: ["./app.component.scss"],
    standalone: true,
    imports: [RouterOutlet, DailyOverviewComponent, DialogComponent, NavBarComponent]
})
export class AppComponent { }
