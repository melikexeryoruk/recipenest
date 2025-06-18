import { Meal } from "@/interfaces/Meal";
import { scaleMeasure } from "./scaleMeasure";

export const getScaledIngredients = (meal: Meal, servings: number = 4) => {
  if (!meal.ingredients || !meal.measures) return [];

  const originalServings = 4; // Assume original recipe is for 4 people
  const scaleFactor = servings / originalServings;

  return meal.ingredients.map((ingredient, index) => ({
    ingredient: ingredient?.trim() || "",
    measure: meal.measures?.[index]
      ? scaleMeasure(meal.measures[index].trim(), scaleFactor)
      : "",
  }));
};
