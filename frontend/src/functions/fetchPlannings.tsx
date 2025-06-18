import { API_URL } from "../../config";
import { getMealById } from "../functions/functions"; // of hoe je een maaltijd ophaalt

export const fetchPlannings = async (userid: string) => {
  const response = await fetch(`${API_URL}/plans/${userid}`);
  const data = await response.json();

  const grouped: { [date: string]: any[] } = {};

  for (const plan of data) {
    if (!grouped[plan.date]) grouped[plan.date] = [];

    const mealDetails = await getMealById(plan.meal_id); // 🥘 haal maaltijd op
    grouped[plan.date].push({
      meal: mealDetails,
      personCount: Number(plan.person_count),
    });
  }

  // Omvormen naar lijst per dag
  const result = Object.entries(grouped).map(([date, meals]) => ({
    date,
    meals,
  }));

  return result;
};
