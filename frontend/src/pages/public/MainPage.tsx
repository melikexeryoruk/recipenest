import { fetchMeals } from "@/api/fetchMeals";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthProvider";
import { useFavorites } from "@/contexts/FavoritesProvider";
import { useRecipe } from "@/contexts/RecipesProvider";
import { sortMealsByDateNewestFirst } from "@/functions/functions";
import { Meal } from "@/interfaces/Meal";
import { useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { NavigateFunction, useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate: NavigateFunction = useNavigate();

  const { recipes, setRecipes } = useRecipe();
  const { favorites, addFavorite, removeFavorite, fetchFavorites } =
    useFavorites(); // <-- haal favorieten uit context
  const { user } = useAuth();

  useEffect(() => {
    console.log("user: ", user);

    const loadMeals = async () => {
      const data = await fetchMeals();
      if (data) setRecipes(data);
    };

    loadMeals();
  }, []);

  useEffect(() => {
    console.log("user found?: ", user);
    if (user) fetchFavorites(user?.id);
    const loadFavorites = async () => {
      if (user) {
        await fetchFavorites(user.id); // wachten tot het klaar is
      }
    };

    loadFavorites();
  }, [user]);

  useEffect(() => {
    console.log("favorieten zijn geüpdatet:", favorites);
  }, [favorites]);

  const toggleFavorite = async (mealid: string) => {
    if (user) {
      const alreadyFavorite = favorites.some((fav) => fav.mealid === mealid);

      if (alreadyFavorite) {
        await removeFavorite(user.id, mealid);
      } else {
        await addFavorite(user.id, mealid);
      }
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some((fav) => fav.mealid === id);
  };

  return (
    <>
      {console.log("user2: ", user)}
      {recipes ? (
        <div className="bg-white w-300">
          Totaal aantal maaltijden: {recipes.length}
          <div className="flex flex-wrap justify-center">
            {sortMealsByDateNewestFirst(recipes).map((meal: Meal) => (
              <Card
                key={meal.id}
                className="m-2 w-60 h-60 bg-slate-50 border-white hover:shadow-2xl hover:cursor-pointer hover:border-amber-950"
              >
                <CardTitle className="ml-5 text-xl my-0 flex justify-between items-center">
                  {meal.name}
                  <button
                    onClick={() => toggleFavorite(meal.id || "0")}
                    className="mr-5"
                  >
                    {meal.id && user && isFavorite(meal.id) ? (
                      <AiFillHeart className="text-red-800" />
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </button>
                </CardTitle>
                <img
                  src={meal.meal_thumb || meal.img_source}
                  className="w-60 h-40.5 object-cover mx-auto rounded-b-2xl"
                  alt={meal.name}
                  onClick={() => navigate(`/meal/${meal.id}`, { state: meal })}
                />
                <CardContent></CardContent>
                <CardFooter></CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p>Geen Recepten gevonden</p>
      )}
    </>
  );
};

export default MainPage;
