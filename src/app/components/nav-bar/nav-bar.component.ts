import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Route, Router, RouterLink } from "@angular/router";
import { distinctUntilChanged, filter, skip, Subject, takeUntil } from "rxjs";
import { OVERVIEW_ROUTE, VIEW_ITEMS_ROUTE } from "src/app/routes/routes";


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
                                {{route.title}}
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
export class NavBarComponent implements OnDestroy {
    private hiddenRoutes = [OVERVIEW_ROUTE, VIEW_ITEMS_ROUTE]

    protected routes: Route[] = [];

    private readonly destroyed = new Subject<void>();

    constructor(router: Router) {
        // todo sasha: find out why this doesn't work with ActivatedRoute.
        router.events.pipe(takeUntil(this.destroyed), filter(event => event instanceof NavigationEnd), skip(1)).subscribe(e => {
            this.flipItems();
        });
    }

    public ngOnDestroy(): void {
        this.destroyed.next();
    }

    protected flipItems() {
        const temp = this.hiddenRoutes;

        this.hiddenRoutes = this.routes;
        this.routes = temp;
    }
}