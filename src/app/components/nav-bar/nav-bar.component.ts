import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink, Routes } from "@angular/router";
import { OVERVIEW_ROUTE, RouteWithName, VIEW_ITEMS_ROUTE } from "src/app/routes/routes";


@Component({
    selector: "oww-nav-bar",
    styleUrls: ["./nav-bar.component.scss"],
    template: `
          <nav>
                <div class="logo-and-items-container">
                    <button class="plain-button" (click)="flipItems()">
                        <img id="app-logo" src="assets/images/logo.jpg">
                    </button>
                    <ul *ngFor="let route of routes">
                        <li>
                            <a [routerLink]="route.path">
                                {{route.name}}
                            </a>
                        </li>
                    </ul>
                </div>

                <h1>nehama.net</h1>
            </nav>
    `,
    standalone: true,
    imports: [NgFor, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
    private hiddenRoutes = [OVERVIEW_ROUTE, VIEW_ITEMS_ROUTE]

    protected routes: RouteWithName[] = [];

    protected flipItems() {
        const temp = this.hiddenRoutes;

        this.hiddenRoutes = this.routes;
        this.routes = temp;
    }
}