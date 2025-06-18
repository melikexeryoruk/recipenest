import { Meal } from "./Meal";

export interface Favorites {
  userid: string;
  favorites: Meal[];
}
