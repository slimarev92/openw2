import { Component } from "@angular/core";
import { DailyOverviewComponent } from "./components/daily-overview/daily-overview.component";
import { DialogComponent } from "./components/dialog/dialog.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [DailyOverviewComponent, DialogComponent]
})
export class AppComponent {
  title = 'openw2';
}
