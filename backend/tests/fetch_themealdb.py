import requests
import uuid
from dataclasses import asdict
from azure.cosmos import CosmosClient, PartitionKey
from domain.config.cosmos_config import endpoint, key, db_name, container_meals # type: ignore
from domain.models.meal import Meal  # type: ignore
from domain.repos.meal_repo import add_meal # type: ignore

# Cosmos setup
client = CosmosClient(endpoint, key)
database = client.create_database_if_not_exists(id=db_name)
container = database.create_container_if_not_exists(
    id=container_meals,
    partition_key=PartitionKey(path="/mealid"),
    offer_throughput=400
)

def fetch_meals():
    response = requests.get("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    data = response.json()
    return data["meals"]


def parse_meal(meal_data):
    ingredients = []
    measures = []

    for i in range(1, 21):
        ing = meal_data.get(f"strIngredient{i}")
        meas = meal_data.get(f"strMeasure{i}")
        if ing and ing.strip():
            ingredients.append(ing.strip())
            measures.append(meas.strip() if meas else "")

    return Meal(
        id=str(uuid.uuid4()),
        mealid=meal_data["idMeal"],
        name=meal_data["strMeal"],
        category=meal_data.get("strCategory", ""),
        area=meal_data.get("strArea", ""),
        meal_thumb=meal_data.get("strMealThumb"),
        youtubeLink=meal_data.get("strYoutube"),
        source=meal_data.get("strSource"),
        img_source=meal_data.get("strImageSource"),
        date_modified=meal_data.get("dateModified"),
        ingredients=ingredients,
        measures=measures,
        instructions=meal_data.get("strInstructions")
    )


def fetch_and_store_meals():
    meals_data = fetch_meals()
    for m in meals_data:
        meal = parse_meal(m)
        result = add_meal(meal)
        if result:
            print(f'Meal toegevoegd: {meal.name}')
        else:
            print(f'❌ Meal NIET toegevoegd: {meal.name}')


if __name__ == "__main__":
    fetch_and_store_meals()