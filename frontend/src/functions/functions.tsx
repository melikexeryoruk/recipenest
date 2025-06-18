import { Meal } from "@/interfaces/Meal";
import { API_URL } from "../../config";

export const sortMealsByDateNewestFirst = (meals: Meal[]): Meal[] => {
  return meals.sort((a, b) => {
    // Zet de datumstrings om naar getallen (timestamps) voor vergelijking
    const dateA = Number(a.date);
    const dateB = Number(b.date);

    // Nieuwste bovenaan = groter getal eerst
    return dateB - dateA;
  });
};

export const getMealById = async (id: string) => {
  const response = await fetch(`${API_URL}/meals/${id}`);
  return await response.json();
};
