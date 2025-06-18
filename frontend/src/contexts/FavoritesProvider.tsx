import { Meal } from "@/interfaces/Meal";
import { API_URL } from "../../config";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type FunctionComponent,
} from "react";

type FavoritesContextType = {
  favorites: Meal[];
  fetchFavorites: (userid: string) => void;
  addFavorite: (userid: string, mealid: string) => void;
  removeFavorite: (userid: string, mealid: string) => void;
  setFavorites: React.Dispatch<React.SetStateAction<Meal[]>>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Meal[]>([]);

  // GET
  const fetchFavorites = async (userid: string) => {
    try {
      const res = await fetch(`${API_URL}/favorites/${userid}/details`);
      if (!res.ok) {
        console.error("HTTP error bij fetchFavorites:", res.status);
        return;
      }
      const data: Meal[] = await res.json();
      setFavorites(data);
      console.log("fetched favorites:", data);
    } catch (error) {
      console.error("Fout bij fetchFavorites:", error);
    }
  };

  // POST
  const addFavorite = async (userid: string, mealid: string) => {
    try {
      const res = await fetch(`${API_URL}/favorites/${userid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "", mealid }),
      });

      if (res.ok) {
        const newFav: Meal = await res.json();
        setFavorites((prev) => [...prev, newFav]);
      } else {
        console.error("Fout bij addFavorite:", res.status);
      }
    } catch (err) {
      console.error("Netwerkfout bij addFavorite:", err);
    }
  };

  // DELETE
  const removeFavorite = async (userid: string, mealid: string) => {
    try {
      const res = await fetch(`${API_URL}/favorites/${userid}/${mealid}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.id !== mealid));
      } else {
        console.error("Fout bij removeFavorite:", res.status);
      }
    } catch (err) {
      console.error("Netwerkfout bij removeFavorite:", err);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        fetchFavorites,
        addFavorite,
        removeFavorite,
        setFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
