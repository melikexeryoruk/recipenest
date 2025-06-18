import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SaveRecipe } from "@/functions/saveRecipe";
import { Meal } from "@/interfaces/Meal";
import { useRecipe } from "@/contexts/RecipesProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { NavigateFunction, useNavigate } from "react-router-dom";

type IngredientMeasure = {
  ingredient: string;
  measure: string;
};

const initialFormData = {
  name: "",
  description: "",
  ingredientsMeasures: [{ ingredient: "", measure: "" }],
  instructions: [""],
  img_source: "",
  youtubeLink: "",
  area: "",
  category: "",
};

const MealAdd = () => {
  const [formData, setFormData] = useState(initialFormData);
  const { addRecipe } = useRecipe();
  const { user } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  const handleChange = (
    index: number,
    field: keyof IngredientMeasure,
    value: string
  ) => {
    const updated = [...formData.ingredientsMeasures];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, ingredientsMeasures: updated }));
  };

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      ingredientsMeasures: [
        ...prev.ingredientsMeasures,
        { ingredient: "", measure: "" },
      ],
    }));
  };

  const removeRow = (index: number) => {
    const updated = formData.ingredientsMeasures.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, ingredientsMeasures: updated }));
  };

  const format_instructions = (array: string[]): string => {
    let output = "";
    array.forEach((step, index) => {
      output += `STAP ${index + 1}\r\n${step}\r\n\r\n`;
    });
    return output.trim(); // optioneel: trims de laatste witruimte weg
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeal: Meal = {
      date: Date.now().toString(),
      name: formData.name,
      ingredients: formData.ingredientsMeasures.map((im) =>
        im.ingredient.trim()
      ),
      measures: formData.ingredientsMeasures.map((im) => im.measure.trim()),
      instructions: format_instructions(
        formData.instructions.filter((step) => step.trim() !== "")
      ),
      img_source: formData.img_source,
    };

    if (user) SaveRecipe(newMeal);
    else addRecipe(newMeal);
    setFormData(initialFormData);
    alert("Maaltijd toegevoegd!");
  };

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  return (
    <div className="w-xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Nieuwe Maaltijd Toevoegen
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Naam van de maaltijd
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Categorie</label>
          <Input
            type="text"
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gebied</label>
          <Input
            type="text"
            name="area"
            value={formData.area}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, area: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Link naar een foto
          </label>
          <Input
            type="text"
            name="name"
            value={formData.img_source}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, img_source: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Ingrediënten en hoeveelheden
          </label>
          {formData.ingredientsMeasures.map((im, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Ingredient"
                value={im.ingredient}
                onChange={(e) => handleChange(i, "ingredient", e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Hoeveelheid"
                value={im.measure}
                onChange={(e) => handleChange(i, "measure", e.target.value)}
              />
              {formData.ingredientsMeasures.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeRow(i)}
                >
                  X
                </Button>
              )}
            </div>
          ))}
          <Button className="text-xs" type="button" onClick={addRow}>
            + Voeg toe
          </Button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Bereidingsstappen
          </label>
          {formData.instructions.map((step, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Textarea
                placeholder={`Stap ${i + 1}`}
                value={step}
                onChange={(e) => {
                  const updated = [...formData.instructions];
                  updated[i] = e.target.value;
                  setFormData((prev) => ({ ...prev, instructions: updated }));
                }}
                rows={2}
                required
              />
              {formData.instructions.length > 1 && (
                <Button
                  className="text-xs"
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const updated = formData.instructions.filter(
                      (_, idx) => idx !== i
                    );
                    setFormData((prev) => ({ ...prev, instructions: updated }));
                  }}
                >
                  X
                </Button>
              )}
            </div>
          ))}
          <Button
            className="text-xs"
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                instructions: [...prev.instructions, ""],
              }));
            }}
          >
            + Voeg stap toe
          </Button>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Opslaan</Button>
        </div>
      </form>
    </div>
  );
};

export default MealAdd;
