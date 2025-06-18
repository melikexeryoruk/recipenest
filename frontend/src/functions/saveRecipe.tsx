import { Meal } from "@/interfaces/Meal";
import { API_URL } from "../../config";

export const SaveRecipe = async (meal: Meal) => {
  try {
    const response = await fetch(`${API_URL}/meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meal),
    });

    if (!response.ok) {
      throw new Error("Failed to save recipe");
    }

    // Optioneel: response data verwerken
    // const data = await response.json();
    console.log("response: ", response);
  } catch (error) {
    console.error("Error saving recipe:", error);
    alert("Er is een fout opgetreden bij het opslaan van de maaltijd.");
  }
};
