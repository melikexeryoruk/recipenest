from typing import List
from domain.models.favorite import Favorite
from domain.models.meal import Meal
from domain.repos.favorites_repo import add_favorite, get_favorites, remove_favorite, get_favs_as_meals


def fetch_favorites_by_userid(userid: str) -> List[Favorite]:
    return get_favorites(userid)

def fetch_favorites_objects(meal_ids: List[str]) -> List[Meal]:
    return get_favs_as_meals(meal_ids)

def create_favorite(userid: str, fav: Favorite) -> Favorite:
    return add_favorite(userid, fav)

def delete_favorite(userid: str, mealid: str) -> bool:
    return remove_favorite(userid, mealid)
