import { createAction, props } from "@ngrx/store";

import { MealItemDescription } from "src/app/models/meal-item-description";

export const IMPORT_ITEMS = createAction("[Items] Import items");
export const IMPORT_ITEMS_FINISHED = createAction("[Items] Import items finished", props<{ importedItems: MealItemDescription[] }>());
export const CREATE_ITEM = createAction("[Items] Create item", props<{ itemToCreate: MealItemDescription }>());
export const CREATE_ITEM_FINISHED = createAction("[Items] Create item finished", props<{ createdItem: MealItemDescription }>());