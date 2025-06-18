import React, { useEffect } from "react";
import { useForm } from "@/hooks/useForm";
import { usePlanning } from "@/contexts/PlanningProvider";
import { useFavorites } from "@/contexts/FavoritesProvider";
import { PlannedMeal } from "@/interfaces/Plan";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import savePlanToBackend from "@/functions/savePlanToBackend";
import { sortMealsByDateNewestFirst } from "@/functions/functions";
import { useAuth } from "@/contexts/AuthProvider";

const initialFormValues = {
  date: "",
  meal: "",
  personCount: "4",
};

const PlanningAdd = () => {
  const { formData, handleChange, reset } = useForm(initialFormValues);
  const { listPlan, setListPlans } = usePlanning();
  const { favorites } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    setListPlans([]);
  }, []);

  useEffect(() => {
    console.log("listPlan updated:", listPlan);
  }, [listPlan]);

  // console.log("favs: ", favorites);
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const selectedMeal = favorites?.find((m) => m.name === formData.meal);
    if (!selectedMeal) {
      alert("Ongeldige maaltijd geselecteerd");
      return;
    }

    const newMeal: PlannedMeal = {
      meal: selectedMeal,
      personCount: formData.personCount,
    };

    const existingPlanIndex = listPlan?.findIndex(
      (plan) => plan.date === formData.date
    );

    if (
      existingPlanIndex !== undefined &&
      existingPlanIndex !== -1 &&
      listPlan
    ) {
      // Plan met deze datum bestaat, voeg nieuwe maaltijd toe
      const updatedPlans = [...listPlan];
      const updatedMeals = [...updatedPlans[existingPlanIndex].meals, newMeal];

      updatedPlans[existingPlanIndex] = {
        ...updatedPlans[existingPlanIndex],
        meals: updatedMeals,
      };

      setListPlans(updatedPlans);
    } else {
      // Nieuw plan met datum toevoegen
      setListPlans([
        ...(listPlan ?? []),
        { date: formData.date, meals: [newMeal] },
      ]);
    }

    reset();
  };

  const handleClick_save = () => {
    if (user) savePlanToBackend(listPlan ?? [], user.id);
  };

  if (!favorites) {
    return <div>Laden...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow w-150">
      <h2 className="text-xl font-semibold mb-4">Voeg een planning toe:</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Datum
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-input w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="meal" className="block text-sm font-medium mb-1">
            Maaltijd (exacte naam uit favorieten)
          </label>
          <Select
            options={sortMealsByDateNewestFirst(favorites)?.map((m) => ({
              label: m.name,
              value: m,
            }))}
            onChange={(selected) => {
              if (selected) {
                handleChange({
                  target: { name: "meal", value: selected.value.name },
                } as any);
              }
            }}
            isClearable
            className="mt-1"
          />
        </div>

        <div>
          <label
            htmlFor="personCount"
            className="block text-sm font-medium mb-1"
          >
            Aantal personen
          </label>
          <input
            type="number"
            id="personCount"
            name="personCount"
            className="form-input w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
            value={formData.personCount}
            onChange={handleChange}
            min={1}
            defaultValue={4}
            placeholder="4"
          />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          type="submit"
        >
          Toevoegen
        </button>
      </form>
      <div>
        <h3 className="text-xl font-semibold mb-4 p-3 mt-5">Planningen:</h3>
        <ul>
          {listPlan?.map((plan) => (
            <div key={plan.date + "4"} className="bg-gray-50 rounded-2xl p-4">
              <h2 className="text-lg font-semibold">{plan.date}:</h2>
              {plan.meals.map((li) => (
                <li key={li.meal.id}>
                  {li.meal.name} - {li.personCount} personen
                </li>
              ))}
            </div>
          ))}
        </ul>

        <div className="flex pt-5">
          <div className="ml-auto">
            <Button onClick={handleClick_save}>Sla planningen op</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningAdd;
