import { ItemsState } from "./items/items.state";
import { MealsState } from "./meals/meals.selectors";

export type AppState = {
    meals: MealsState,
    items: ItemsState
}