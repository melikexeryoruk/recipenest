from dataclasses import asdict
from typing import List
import uuid
import os
from azure.cosmos import CosmosClient, PartitionKey, exceptions
from domain.models.planning import Planning

key = os.getenv("key")
container_plans = os.getenv("container_plans")
db_name = os.getenv("db_name")
endpoint = os.getenv("endpoint")

# Cosmos setup
client = CosmosClient(endpoint, key)
database = client.create_database_if_not_exists(id=db_name)
container = database.create_container_if_not_exists(
    id=container_plans,
    partition_key=PartitionKey(path="/userid"),
    offer_throughput=400
)

# Helper om Cosmos meta-data te verwijderen
def clean_cosmos_document(doc: dict) -> dict:
    excluded_keys = ['_rid', '_self', '_etag', '_attachments', '_ts']
    return {k: v for k, v in doc.items() if k not in excluded_keys}


def all_planning(userid: str) -> List[Planning]:
    try:
        query = "SELECT * FROM c WHERE c.userid = @userid"
        parameters = [{"name": "@userid", "value": userid}]
        items = list(container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))
        return [Planning(**clean_cosmos_document(item)) for item in items]
    except Exception as e:
        print("planning_repo - all_planning() -- error", e)
        return []

def add_planning(userid: str, plans: List[Planning]) -> List[Planning] | None:
    try:

        added_plans = []
        existing = all_planning(userid)
        existing_ids = {p.id for p in existing}

        for plan in plans:
            if not plan.id:
                plan.id = str(uuid.uuid4())
            
            if plan.id in existing_ids:
                # Overslaan als al bestaat
                continue

            container.create_item(body=asdict(plan))
            added_plans.append(plan)

        return added_plans
    except Exception as e:
        print("planning_repo - add_planning() -- error", e)
        return None


def delete_planning(userid: str, planid: str) -> Planning | None:
    try:
        plans = all_planning(userid)
        for plan in plans:
            if plan.id == planid:
                container.delete_item(item=plan.id, partition_key=userid)
                return plan
        return None
    except Exception as e:
        print("planning_repo - delete_planning() -- error", e)
        return None

def update_planning(userid: str, planid: str, plan: Planning) -> Planning | None:
    try:
        # check of de planning bestaat
        plans = all_planning(userid)
        for existing in plans:
            if existing.id == planid:
                plan.id = planid
                plan.userid = userid
                container.replace_item(item=planid, body=asdict(plan))
                return plan
        return None
    except Exception as e:
        print("planning_repo - update_planning() -- error", e)
        return None
