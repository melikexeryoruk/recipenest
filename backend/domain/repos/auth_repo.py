from ..models.user import User
from azure.cosmos import CosmosClient, PartitionKey, exceptions
from dataclasses import asdict
import uuid
import os

key = os.getenv("key")
container_users = os.getenv("container_users")
db_name = os.getenv("db_name")
endpoint = os.getenv("endpoint")

client = CosmosClient(endpoint, key)
database = client.create_database_if_not_exists(id=db_name)
container = database.create_container_if_not_exists(
    id=container_users,
    partition_key=PartitionKey(path="/mealid"),
    offer_throughput=400
)

def get_user_by_email(email: str):
    query = "SELECT * FROM c WHERE c.email = @email"
    parameters = [{"name": "@email", "value": email}]
    items = list(container.query_items(query=query, parameters=parameters, enable_cross_partition_query=True))
    if items:
        user = User.from_cosmos(items[0])
        return user
    return None

def create_user(user: User):
    if not user.userid:
        user.userid = str(uuid.uuid4())
    user.id = user.userid

    user_dict = asdict(user)
    user_dict['userid'] = user.userid  # partition key eventueel
    container.create_item(body=user_dict)
    return user
