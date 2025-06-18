import { Meal } from "@/interfaces/Meal";
import { ReactNode, createContext, useContext, useState } from "react";

interface RecipeContextType {
  recipes: Meal[];
  setRecipes: (value: Meal[]) => void;
  addRecipe: (recipe: Meal) => void;
  removeRecipe: (name: string) => void; // Of op basis van id als je die hebt
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Meal[]>([]);

  const addRecipe = (recipe: Meal) => {
    setRecipes((prev) => [...prev, recipe]);
  };

  const removeRecipe = (name: string) => {
    setRecipes((prev) => prev.filter((m) => m.name !== name));
  };

  return (
    <RecipeContext.Provider
      value={{ recipes, setRecipes, addRecipe, removeRecipe }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe moet binnen een RecipeProvider gebruikt worden");
  }
  return context;
};
