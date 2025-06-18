import { Meal } from "@/interfaces/Meal";
import jsPDF from "jspdf";
import { getScaledIngredients } from "./getScaledIngredients";

export const downloadGroceryList = (meal: Meal, personCount: number) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Boodschappenlijst`, 10, 20);
  doc.text(`Recept: ${meal.name}`, 10, 30);
  doc.text(`Aantal personen: ${personCount}`, 10, 40);

  const scaledIngredients = getScaledIngredients(meal, personCount);
  doc.setFontSize(12);
  scaledIngredients.forEach((item, i) => {
    const text = `- ${item.measure} ${item.ingredient}`.trim();
    doc.text(text, 10, 50 + i * 8);
  });

  doc.save(`boodschappen-${meal.name}-${personCount}personen.pdf`);
};
