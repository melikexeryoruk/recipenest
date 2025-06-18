import { Meal } from "./Meal";

export interface PlannedMeal {
  meal: Meal;
  personCount: string;
}

export interface Plan {
  date: string;
  meals: PlannedMeal[];
}
