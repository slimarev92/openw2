import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter, skip } from "rxjs";
import { OVERVIEW_ROUTE, RouteWithResolveFunction, VIEW_ITEMS_ROUTE } from "src/app/routes/routes";

@Component({
    selector: "oww-nav-bar",
    styleUrls: ["./nav-bar.component.scss"],
    template: `
        <nav>
            <div class="logo-and-items-container">
                <button class="plain-button" (click)="flipItems()">
                    <img id="app-logo" src="assets/images/logo.jpg">
                </button>
                <ul>
                    <li *ngFor="let route of routes">
                        <a [routerLink]="route.path">
                            {{route.title()}}
                        </a>
                    </li>
                </ul>
            </div>

            <h1 i18n>nehama.net</h1>
        </nav>
    `,
    standalone: true,
    imports: [NgFor, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
    private hiddenRoutes = [OVERVIEW_ROUTE, VIEW_ITEMS_ROUTE];

    protected routes: RouteWithResolveFunction[] = [];

    constructor(router: Router) {
        // TODO SASHA: find out why this doesn't work with ActivatedRoute.
        router.events.pipe(takeUntilDestroyed(), filter(event => event instanceof NavigationEnd), skip(1)).subscribe(() => {
            this.flipItems();
        });
    }

    protected flipItems() {
        const temp = this.hiddenRoutes;

        this.hiddenRoutes = this.routes;
        this.routes = temp;
    }
}