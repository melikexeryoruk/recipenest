from dataclasses import asdict
from typing import List
import uuid

from flask import jsonify
from domain.models.favorite import Favorite
from azure.cosmos import CosmosClient, PartitionKey, exceptions

from domain.models.meal import Meal
from domain.repos.meal_repo import get_meal
import os


key = os.getenv("key")
container_favs = os.getenv("container_favs")
db_name = os.getenv("db_name")
endpoint = os.getenv("endpoint")



client = CosmosClient(endpoint, key)
database = client.create_database_if_not_exists(id=db_name)
container = database.create_container_if_not_exists(
    id=container_favs, 
    partition_key=PartitionKey(path="/userid"),
    offer_throughput=400
)

def clean_cosmos_document(doc: dict) -> dict:
    excluded_keys = ['_rid', '_self', '_etag', '_attachments', '_ts']
    return {k: v for k, v in doc.items() if k not in excluded_keys}


def get_favorites(userid: str) -> List[Favorite]:
    try:
        query = "SELECT * FROM c WHERE c.userid = @userid"
        parameters = [{"name": "@userid", "value": userid}]
        items = list(container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))
        return [Favorite(**clean_cosmos_document(item)) for item in items]
    except Exception as e:
        print("favorite_repo - get_favorites_by_userid() -- error", e)
        return []

def add_favorite(userid: str, fav: Favorite) -> Favorite:
    try:
        # Zorg dat id uniek is (combinatie van user en meal of gewoon uuid)
        if not fav.id:
            fav.id = str(uuid.uuid4())

        # Optioneel: check of favorite al bestaat
        existing_favs = get_favorites(userid)
        for existing in existing_favs:
            if existing.mealid == fav.mealid:
                print(f"Favorite already exists for user {userid} and meal {fav.mealid}")
                return None

        fav.userid = userid  # zekerheid
        container.create_item(body=asdict(fav))
        return fav
    except Exception as e:
        print("favorite_repo - add_favorite() -- error", e)
        return None


def remove_favorite(userid: str, mealid: str) -> bool:
    try:
        # Zoek de juiste favorite op basis van user & mealid
        favorites = get_favorites(userid)
        for fav in favorites:
            if fav.mealid == mealid:
                container.delete_item(item=fav.id, partition_key=userid)
                return True
        return False
    except Exception as e:
        print("favorite_repo - remove_favorite() -- error", e)
        return False


def get_favs_as_meals(meal_ids: List[str]) -> List[Meal]:
    if not meal_ids:
        print("not meal_ids...")
        return []

    meals = []
    for meal_id in meal_ids:
        meal = get_meal(meal_id)
        if meal:
            meals.append(meal)
    print("meals: ", meals)
    return meals

