import { API_URL } from "../../config";
import { Favorites } from "@/interfaces/Favorites";

export async function fetchFavorites(): Promise<Favorites[] | undefined> {
  const api_url = `${API_URL}/favorites`;

  try {
    console.log("fav api url:", api_url);
    const response = await fetch(api_url);
    const data = await response.json();
    console.log("fetched data as fav: ", data as Favorites);
    return data as Favorites[];
  } catch (error) {
    console.error("Fout bij het ophalen van favs:", error);
    return undefined;
  }
}
