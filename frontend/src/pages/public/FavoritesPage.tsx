import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthProvider";
import { Meal } from "@/interfaces/Meal";
import { API_URL } from "../../../config";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { sortMealsByDateNewestFirst } from "@/functions/functions";

const FavoritesPage = () => {
  const navigate: NavigateFunction = useNavigate();

  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  console.log(favorites);
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await fetch(
          `${API_URL}/favorites/${user?.userid}/details`
        );
        if (!response.ok) {
          console.log("response not ok");
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Meal[] = await response.json();
        setFavorites(data);
      } catch (err) {
        setError(`Failed to load favorites: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user]);

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p>{error}</p>;

  if (!user) navigate("/signin");

  return (
    <>
      {favorites ? (
        <div className="bg-white w-300">
          Totaal aantal maaltijden: {favorites.length}
          <div className="flex flex-wrap justify-center">
            {sortMealsByDateNewestFirst(favorites).map((meal: Meal) => (
              <Card
                key={meal.id}
                className="m-2 w-60 h-60 bg-slate-50 border-white hover:shadow-2xl hover:cursor-pointer hover:border-amber-950"
              >
                <CardTitle className="ml-5 text-xl my-0 flex justify-between items-center">
                  {meal.name}
                  {/* <button onClick={() => toggleFavorite(meal)} className="mr-5">
                    {isFavorite(meal) ? (
                      <AiFillHeart className="text-red-800" />
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </button> */}
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

export default FavoritesPage;
