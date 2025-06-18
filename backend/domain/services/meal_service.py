#### meal_service.py


from ..models.meal import Meal
from ..repos.meal_repo import get_all_meals, add_meal, get_meal, update_meal as repo_update_meal, delete_meal as repo_delete_meal
from typing import List

def fetch_all_meals() -> List[Meal]:
    return get_all_meals()

def fetch_meal(id: str) -> Meal:
    return get_meal(id)

def create_meal(meal: Meal) -> Meal:
    print("Meal to insert:", meal.dict() if hasattr(meal, "dict") else vars(meal))
    return add_meal(meal)
    # met validatie als nodig

def update_meal(meal: Meal) -> Meal:
    return repo_update_meal(meal)

def delete_meal(id: str) -> bool:
    result = repo_delete_meal(id)
    if result is None:
        return False
    return True

