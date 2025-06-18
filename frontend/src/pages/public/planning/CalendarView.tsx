import { usePlanning } from "@/contexts/PlanningProvider";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { Plan, PlannedMeal } from "@/interfaces/Plan";
import { format } from "date-fns";
import { downloadGroceryList } from "@/functions/downloadGroceryList";
import { FaDownload } from "react-icons/fa";

const CalendarPlanning = () => {
  const { listPlan } = usePlanning();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getMealsForDate = (date: Date): PlannedMeal[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    const plan: Plan | undefined = listPlan?.find((p) => p.date === dateStr);
    return plan?.meals || [];
  };

  return (
    <div className="p-6 w-150 mx-auto ">
      <h1 className="text-3xl font-bold text-left text-indigo-600 mb-6 ml-27">
        Kalenderplanning
      </h1>

      <div className="max-w-md mx-auto">
        <Calendar
          onClickDay={(value) => setSelectedDate(value)}
          tileContent={({ date, view }) => {
            if (view === "month") {
              const meals = getMealsForDate(date);
              if (meals.length === 0) return null;
              return (
                <div className="flex justify-center mt-1">
                  {meals.slice(0, 3).map((plannedMeal, idx) => (
                    <span
                      key={idx}
                      className="w-2 h-2 bg-indigo-600 rounded-full"
                      title={`Maaltijd gepland: ${plannedMeal.meal.name}`}
                    />
                  ))}
                  {meals.length > 3 && (
                    <span className="text-xs text-indigo-600 ml-1">
                      +{meals.length - 3}
                    </span>
                  )}
                </div>
              );
            }
            return null;
          }}
          className="rounded-lg shadow border"
        />
      </div>

      {selectedDate && (
        <div className="mt-8 bg-white rounded-lg shadow p-6  mx-auto w-130">
          <h2 className="text-xl font-semibold mb-4">
            Maaltijden op {format(selectedDate, "dd MMMM yyyy")}
          </h2>
          <ul className="space-y-3">
            {getMealsForDate(selectedDate).map((plannedMeal) => (
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
            ))}
            {getMealsForDate(selectedDate).length === 0 && (
              <p className="text-gray-500">Geen maaltijden gepland.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarPlanning;
