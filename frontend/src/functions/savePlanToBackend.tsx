import { Plan } from "@/interfaces/Plan";
import { API_URL } from "../../config";
import { v4 as uuidv4 } from "uuid";

interface Planning {
  userid: string;
  meal_id: string;
  person_count: string;
  date: string;
  id?: string;
}

const savePlanToBackend = async (plans: Plan[] = [], userid: string) => {
  try {
    console.log("input savetobackend en userid: ", plans, userid);
    const plannings: Planning[] = [];

    plans.forEach((plan) => {
      plan.meals.forEach((mealItem) => {
        plannings.push({
          userid: userid,
          meal_id: mealItem.meal.id || "0", // ← array van 1 meal_id
          person_count: mealItem.personCount,
          date: plan.date,
          id: uuidv4(),
        });
      });
    });

    console.log("Verstuurde data naar backend:", plannings);

    const response = await fetch(`${API_URL}/plans/${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plannings),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend error response:", text);
      throw new Error("Opslaan naar backend mislukt");
    }

    const result = await response.json();
    console.log("Opslaan succesvol:", result);
  } catch (error) {
    console.error("Error bij opslaan:", error);
  }
};

export default savePlanToBackend;
