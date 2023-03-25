import { Route, RouterHashLocationFeature, Routes } from "@angular/router";
import { DailyOverviewComponent } from "../components/daily-overview/daily-overview.component";
import { ViewItemsComponent } from "../components/view-items/view-items.component";

export const OVERVIEW_ROUTE: Route = {
    title: "Overview",
    path: "overview",
    component: DailyOverviewComponent
}

export const VIEW_ITEMS_ROUTE: Route = {
    title: "All items",
    path: "all-items",
    component: ViewItemsComponent
}

export const APP_ROUTES: Routes = [
    { 
        path: "",
        redirectTo: "/overview", 
        pathMatch: "full"
    },
    OVERVIEW_ROUTE,
    VIEW_ITEMS_ROUTE
];