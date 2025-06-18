// import { Button } from "@/components/ui/button";
// import { useFavorites } from "@/contexts/FavoritesProvider";
// import { Meal } from "@/interfaces/Meal";
// import Select from "react-select";
// import { useState } from "react";
// import { usePlanning } from "@/contexts/PlanningProvider";
// import { jsPDF } from "jspdf";
// import { scaleMeasure } from "@/functions/scaleMeasure";
// import { FaDownload } from "react-icons/fa";
// import { Plan, PlannedMeal } from "@/interfaces/Plan";

// const ListPlanning = () => {
//   // const { favorites } = useFavorites();
//   // const [selectedDate, setSelectedDate] = useState<string>("");
//   // const [selectedMeals, setSelectedMeals] = useState<Meal>();
//   // const [personCount, setPersonCount] = useState<number>(4);
//   // const { listPlan, setListPlans } = usePlanning();
//   // const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
//   // const togglePlanSelection = (date: string) => {
//   //   setSelectedPlans((prev) => {
//   //     const updated = prev.includes(date)
//   //       ? prev.filter((d) => d !== date)
//   //       : [...prev, date];
//   //     console.log("onchange selected: ", updated);
//   //     return updated;
//   //   });
//   // };
//   // const extractIngredients = (meal: Meal, servings: number = 4): string[] => {
//   //   const result: string[] = [];
//   //   if (!meal.ingredients || !meal.measures) return result;
//   //   const originalServings = 4;
//   //   const scaleFactor = servings / originalServings;
//   //   for (let i = 0; i < meal.ingredients.length; i++) {
//   //     const ingredient = meal.ingredients[i]?.trim();
//   //     const measure = meal.measures[i]?.trim();
//   //     if (ingredient) {
//   //       const scaledMeasure = measure ? scaleMeasure(measure, scaleFactor) : "";
//   //       result.push(`${scaledMeasure} ${ingredient}`.trim());
//   //     }
//   //   }
//   //   return result;
//   // };
//   // const downloadGroceriesForMeal = (meal: Meal, date: string) => {
//   //   const doc = new jsPDF();
//   //   doc.setFontSize(16);
//   //   doc.text("Boodschappenlijst", 10, 20);
//   //   doc.text(`Datum: ${date}`, 10, 30);
//   //   doc.text(`Maaltijd: ${meal.name}`, 10, 40);
//   //   doc.text(`Aantal personen: ${personCount}`, 10, 50);
//   //   const ingredients = extractIngredients(meal, personCount);
//   //   doc.setFontSize(12);
//   //   ingredients.forEach((item, i) => {
//   //     const y = 60 + i * 8;
//   //     if (y > 280) {
//   //       doc.addPage();
//   //       doc.text("Boodschappenlijst vervolg", 10, 20);
//   //     }
//   //     doc.text(`- ${item}`, 10, y > 280 ? 30 : y);
//   //   });
//   //   doc.save(`boodschappen-${meal.name}-${date}-${personCount}p.pdf`);
//   // };
//   // const handleBatchDownload = () => {
//   //   selectedPlans.forEach((date) => {
//   //     const plan = listPlan?.find((p) => p.date === date);
//   //     plan?.meals.forEach((meal) => {
//   //       downloadGroceriesForMeal(meal.meal, date);
//   //     });
//   //   });
//   // };
//   // const options =
//   //   favorites?.map((fav) => ({
//   //     value: fav,
//   //   })) || [];
//   // const handleAddPlan = () => {
//   //   if (!selectedMeals || !selectedDate) return;
//   //   const newMeal: PlannedMeal = { meal: selectedMeals, personCount };
//   //   const existingPlan = listPlan?.find((plan) => plan.date === selectedDate);
//   //   if (existingPlan) {
//   //     existingPlan.meals.push(newMeal);
//   //     setListPlans([...(listPlan ?? [])]);
//   //   } else {
//   //     setListPlans([
//   //       ...(listPlan ?? []),
//   //       { date: selectedDate, meals: [newMeal] },
//   //     ]);
//   //   }
//   //   setSelectedMeals(undefined);
//   // };
//   // const handleRemoveMeal = (date: string, mealId: string) => {
//   //   if (!listPlan) return;
//   //   const updated = listPlan.map((plan) =>
//   //     plan.date === date
//   //       ? {
//   //           ...plan,
//   //           meals: plan.meals.filter((m) => m.meal.id !== mealId),
//   //         }
//   //       : plan
//   //   );
//   //   setListPlans(updated);
//   // };
//   // return (
//   // <div className="justify-center items-center min-h-screen p-5">
//   //   <div className="flex space-x-5 items-center mb-4">
//   //     <p>Maak planning voor:</p>
//   //     <input
//   //       type="date"
//   //       name="datum"
//   //       className="bg-white border-2 p-2"
//   //       onChange={(e) => setSelectedDate(e.target.value)}
//   //       value={selectedDate}
//   //     />
//   //   </div>
//   //   <div className="flex space-x-5 items-center mb-4">
//   //     <p>Aantal personen:</p>
//   //     <select
//   //       value={personCount}
//   //       onChange={(e) => setPersonCount(parseInt(e.target.value))}
//   //       className="bg-white border-2 p-2 rounded"
//   //     >
//   //       {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
//   //         <option key={num} value={num}>
//   //           {num}
//   //         </option>
//   //       ))}
//   //     </select>
//   //   </div>
//   //   <p className="p-2">Kies een maaltijd uit favorieten:</p>
//   //   <Select
//   //     options={options}
//   //     value={option => option.}
//   //     isClearable
//   //     onChange={(selected) => {
//   //       setSelectedMeals(selected?.value);
//   //     }}
//   //   />
//   //   <Button className="m-5 mr-auto ml-0" onClick={handleAddPlan}>
//   //     Voeg toe
//   //   </Button>
//   //   <div className="mt-10 bg-white p-4 rounded-2xl">
//   //     <h2 className="text-lg font-semibold pb-3">Planning:</h2>
//   //     {listPlan?.map((plan: Plan) => (
//   //       <div key={plan.date} className="mb-4 border p-3 shadow rounded-xl">
//   //         <div className="flex items-center justify-between mb-2 ">
//   //           <h3 className="font-semibold text-md ">
//   //             {plan.date} - {personCount} personen
//   //           </h3>
//   //           <label className="flex items-center space-x-2">
//   //             <input
//   //               type="checkbox"
//   //               checked={selectedPlans.includes(plan.date)}
//   //               onChange={() => togglePlanSelection(plan.date)}
//   //             />
//   //             <span>Selecteer</span>
//   //           </label>
//   //         </div>
//   //         {plan.meals.map((meal) => (
//   //           <li
//   //             key={meal.meal.id}
//   //             className="flex justify-between items-center mb-2"
//   //           >
//   //             <span>{meal.meal.name}</span>
//   //             <div className="flex gap-2">
//   //               <Button
//   //                 size="sm"
//   //                 onClick={() =>
//   //                   downloadGroceriesForMeal(meal.meal, plan.date)
//   //                 }
//   //               >
//   //                 🧾 Download
//   //               </Button>
//   //               <Button
//   //                 size="sm"
//   //                 variant="destructive"
//   //                 onClick={() => handleRemoveMeal(plan.date, meal.meal.id)}
//   //               >
//   //                 ❌
//   //               </Button>
//   //             </div>
//   //           </li>
//   //         ))}
//   //       </div>
//   //     ))}
//   //     {selectedPlans.length > 0 && (
//   //       <Button
//   //         className="mt-5 bg-green-600 hover:bg-green-700"
//   //         onClick={handleBatchDownload}
//   //       >
//   //         <FaDownload />
//   //         Download geselecteerde boodschappenlijsten
//   //       </Button>
//   //     )}
//   //   </div>
//   // </div>
//   // );
// };

// export default ListPlanning;
