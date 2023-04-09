import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MealItemDescription } from "src/app/models/meal-item-description";
import { MealItemType } from "src/app/models/meal-type";

const ITEM_DESCRIPTIONS: MealItemDescription[] = [
    {
        name: "Hummus",
        type: MealItemType.Protein, 
        points: 10
    },
    {
        name: "Hummus2",
        type: MealItemType.Protein, 
        points: 10
    },
    {
        name: "Apple",
        type: MealItemType.Fruit, 
        points: 5
    },
    {
        name: "Loaf of bread",
        type: MealItemType.Regular, 
        points: 2
    }
];


export default function handler() {
    return new Response(
        JSON.stringify(ITEM_DESCRIPTIONS),
        {
            status: 200,
            headers: { "content-type": "application/json "}
        }
    );
}