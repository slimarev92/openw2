  import { Component } from "@angular/core";
import { DailyOverviewComponent } from "./components/daily-overview/daily-overview.component";
import { DialogComponent } from "./components/dialog/dialog.component";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";


@Component({
    selector: 'app-root',
    template: `
      <oww-nav-bar></oww-nav-bar>

      <oww-daily-overview></oww-daily-overview>

      <oww-dialog></oww-dialog>
    `,
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [DailyOverviewComponent, DialogComponent, NavBarComponent]
})
export class AppComponent { }
