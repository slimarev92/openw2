import { ResolveFn, Route } from "@angular/router";
import { DailyOverviewComponent } from "../components/daily-overview/daily-overview.component";

type HasResolveFunction = {
    title: () => string | ResolveFn<string>
}

export type RouteWithResolveFunction = Route & HasResolveFunction;

export const OVERVIEW_ROUTE: RouteWithResolveFunction = {
    title: () => $localize `Overview`,
    path: "overview",
    component: DailyOverviewComponent
};

export const VIEW_ITEMS_ROUTE: RouteWithResolveFunction = {
    title: () => $localize `All Items`,
    path: "all-items",
    loadComponent: () => import("../components/view-items/view-items.component").then(m => m.ViewItemsComponent)
};

export const APP_ROUTES: RouteWithResolveFunction[] = [
    { 
        title: () => "",
        path: "",
        redirectTo: "/overview", 
        pathMatch: "full"
    },
    OVERVIEW_ROUTE,
    VIEW_ITEMS_ROUTE
];