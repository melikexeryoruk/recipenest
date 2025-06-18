import { Meal } from "@/interfaces/Meal";
import { API_URL } from "../../config";

export async function fetchMeals(): Promise<Meal[] | undefined> {
  const api_url = `${API_URL}/meals`;

  try {
    console.log("api url:", api_url);
    const response = await fetch(api_url);

    if (!response.ok) {
      console.error("HTTP error bij fetchMeals:", response.status);
      return undefined;
    }

    const data = await response.json();
    console.log("fetched data:", data);

    // Kijk hier goed na wat je API terugstuurt:
    // is het een array Meal[]? Of zit het in een property zoals { meals: Meal[] } ?

    if (Array.isArray(data)) {
      return data as Meal[];
    }
    if (data.meals && Array.isArray(data.meals)) {
      return data.meals as Meal[];
    }

    console.error("Unexpected data structure in fetchMeals:", data);
    return undefined;
  } catch (error) {
    console.error("Fout bij het ophalen van meals:", error);
    return undefined;
  }
}
