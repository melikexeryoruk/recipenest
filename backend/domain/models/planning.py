from dataclasses import asdict, dataclass
from typing import List, Optional
from enum import Enum
from datetime import date
import uuid



@dataclass
class Planning:
    id: str
    userid: str
    meal_id: str
    person_count: int
    date: date


def to_dict(self):
        return asdict(self)