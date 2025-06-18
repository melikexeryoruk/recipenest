

from typing import List
from domain.models.planning import Planning
from domain.repos.planning_repo import all_planning as repo_getall, add_planning as repo_add, delete_planning as repo_delete, update_planning as repo_update


def get_plannings(userid) -> List[Planning]:
    return repo_getall(userid)

def add_planning(userid, plans) -> Planning:
    return repo_add(userid, plans) 

def remove_planning(userid, planid) -> Planning:
    return repo_delete(userid, planid)

def update_planning(userid, planid) -> Planning:
    return repo_update(userid, planid)