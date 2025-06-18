import { downloadGroceryList } from "@/functions/downloadGroceryList";
import { FaDownload } from "react-icons/fa";
import { usePlanning } from "@/contexts/PlanningProvider";
import { format, parseISO } from "date-fns";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { fetchPlannings } from "@/functions/fetchPlannings";
import { NavigateFunction, useNavigate } from "react-router-dom";

const ListViewByDate = () => {
  const { listPlan, setListPlans } = usePlanning();
  const { user } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        const plans = await fetchPlannings(user.id);
        setListPlans(plans); // <--- vergeet deze niet
      }
    };
    loadData();
  }, []);

  if (!listPlan || listPlan.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow p-6 mx-auto w-150">
        <p className="text-gray-500">Nog geen maaltijden gepland.</p>
      </div>
    );
  }
  if (!user) navigate("/signin");

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6 mx-auto w-150">
      {listPlan.map((plan) => (
        <div key={plan.date} className="mb-8">
          {/* Titel met datum, bv. 13 juni 2025 */}
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
            {format(parseISO(plan.date), "dd MMMM yyyy")}
          </h2>

          <ul className="space-y-3">
            {plan.meals.length > 0 ? (
              plan.meals.map((plannedMeal) => (
                <li
                  key={
                    plannedMeal.meal.id ||
                    plannedMeal.meal.mealid ||
                    Math.random()
                  }
                  className="flex justify-between items-center bg-indigo-50 p-3 rounded shadow-sm w-120"
                >
                  <span className="font-medium text-gray-800">
                    {plannedMeal.meal.name}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      Aantal personen: {plannedMeal.personCount}
                    </span>
                    <button
                      onClick={() =>
                        downloadGroceryList(
                          plannedMeal.meal,
                          Number(plannedMeal.personCount)
                        )
                      }
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">Geen maaltijden gepland.</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ListViewByDate;
