##### meal_repo.py


from ..models.meal import Meal
from typing import List, Tuple, Optional
from azure.cosmos import CosmosClient, PartitionKey, exceptions
from dataclasses import asdict
import uuid
import os

key = os.getenv("key")
container_meals = os.getenv("container_meals")
db_name = os.getenv("db_name")
endpoint = os.getenv("endpoint")


client = CosmosClient(endpoint, key)

database = client.create_database_if_not_exists(id=db_name)
container = database.create_container_if_not_exists(
    id=container_meals,
    partition_key=PartitionKey(path="/mealid"),
    offer_throughput=400
)

def clean_cosmos_document(doc: dict) -> dict:
    excluded_keys = ['_rid', '_self', '_etag', '_attachments', '_ts']
    return {k: v for k, v in doc.items() if k not in excluded_keys}

def get_all_meals() -> List[Meal]:
    try:
        query = "select * from c"
        items = list(container.query_items(query=query, enable_cross_partition_query=True))
        meals = []
        for doc in items:
            clean_doc = clean_cosmos_document(doc)
            if 'soure' in clean_doc:
                clean_doc['source'] = clean_doc.pop('soure')
            meal = Meal(**clean_doc)
            meals.append(meal)
        return meals
    except Exception as e:
        print("meal_repo - get_all_meals() -- error", e)
        return []


def get_meal(id: str) -> Optional[Meal]:
    try:
        print("get_meal -- meal_repo")
        query = "select * from c where c.id = @id"
        parameters = [
            {"name": "@id", "value": id}
        ]
        items = list(container.query_items(
            query=query, 
            parameters=parameters, 
            enable_cross_partition_query=True
        ))
        print("items: ", items)
        if items:
            clean_doc = clean_cosmos_document(items[0])
            print("clean_doc: ", clean_doc)
            return Meal(**clean_doc)

            # clean_doc = clean_cosmos_document(items[0])
            # clean_doc['mealid'] = clean_doc['id']
            # return Meal(**clean_doc)
        else:
            print("gel_meal - else")
            return None

    except Exception as e:
        print("meal_repo - get_meal(id) -- error", e)
        return None

def add_meal(meal: Meal) -> Meal:
    try:
        if not meal.id:
            meal.id = str(uuid.uuid4())  # genereert een unieke string-id
        else:
            existing = get_meal(meal.id)
            if existing:
                print(f'Meal with same id already exists: "{meal.id}"')
                return None
        
        meal.mealid = meal.id  
        print("Meal to insert:", asdict(meal))
        meal_dict = asdict(meal)
        meal_dict['mealid'] = meal.id
        container.create_item(body=meal_dict)
        return meal
    except Exception as e:
        print("meal_repo - add_meal(meal) -- error", e)
        return None


def update_meal(meal: Meal) -> Meal:
    try:
        if not meal.id:
            print("update_meal -- meal had no id")
            return None
        meal_dict = asdict(meal)
        partition_key = meal.id
        existing = container.read_item(item=meal.id, partition_key=partition_key)

        for key in ['_rid', '_self', '_etag', '_attachments', '_ts']:
            meal_dict[key] = existing.get(key)

        container.replace_item(item=meal.id, body=meal_dict)
        return meal
    
    except exceptions.CosmosResourceNotFoundError:
        print("meal_repo - update_meal(meal) -- meal not found")
        return None

    except Exception as e:
        print("meal_repo - update_meal(meal) -- error", e)
        return None

def delete_meal(id: str) -> bool:
    existing = get_meal(id)
    if not existing:
        return False
    partition_key = existing.mealid
    container.delete_item(item=id, partition_key=partition_key)
    return True
