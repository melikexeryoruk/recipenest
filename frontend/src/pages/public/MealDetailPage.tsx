import { Meal } from "@/interfaces/Meal";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getScaledIngredients } from "@/functions/getScaledIngredients";
import { downloadGroceryList } from "@/functions/downloadGroceryList";

const MealDetailPage = () => {
  const location = useLocation();
  const meal: Meal = location.state;
  const [personCount, setPersonCount] = useState<number>(4); // Default to 4 people

  let ingredients: string[] = [];
  if (meal.ingredients) {
    ingredients = meal.ingredients;
  }
  console.log("ingredients: ", ingredients);

  const parts = meal.instructions?.split("STEP ");
  const steps: string[] = [];

  parts?.forEach((part) => {
    if (part.trim() != "") {
      steps.push("STEP " + part.trim());
    }
  });

  const scaledIngredients = getScaledIngredients(meal, personCount);

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-700">
        {meal.name}
      </h1>

      {/* Person count selector */}
      <div className="flex justify-center items-center mb-8 bg-indigo-50 rounded-lg p-4">
        <label className="text-lg font-semibold text-gray-800 mr-4">
          Aantal personen:
        </label>
        <select
          value={personCount}
          onChange={(e) => setPersonCount(parseInt(e.target.value))}
          className="bg-white border-2 border-indigo-300 p-2 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <Button
          onClick={() => downloadGroceryList(meal, personCount)}
          className="ml-4 bg-indigo-600 hover:bg-indigo-700"
        >
          🧾 Download boodschappenlijst
        </Button>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-indigo-300 pb-2">
          Ingrediënten {personCount !== 4 && `(voor ${personCount} personen)`}
        </h2>
        <ul className="space-y-3">
          {scaledIngredients.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-indigo-50 rounded-lg px-5 py-3 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-gray-900 font-medium">
                {item.ingredient}
              </span>
              <span className="text-indigo-600 italic font-semibold">
                {item.measure}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-indigo-300 pb-2">
          Instructies
        </h2>
        <ol className="list-decimal list-inside space-y-4">
          {steps.map((step, index) => (
            <li
              key={index}
              className="bg-indigo-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 text-gray-800 leading-relaxed"
            >
              {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default MealDetailPage;
