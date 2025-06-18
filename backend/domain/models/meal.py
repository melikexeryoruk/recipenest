from dataclasses import asdict, dataclass
from typing import List, Optional

@dataclass
class Meal:
    id: Optional[str] = None
    name: str = ""
    mealid: Optional[str] = None  # voor cosmos partitionkey
    category: str = ""
    subcategory: Optional[str] = None
    instructions: Optional[str] = None
    area: str = ""
    meal_thumb: Optional[str] = None
    source: Optional[str] = None
    img_source: Optional[str] = None
    date: Optional[str] = None
    date_modified: Optional[str] = None
    youtubeLink: Optional[str] = None
    ingredients: Optional[List[str]] = None
    measures: Optional[List[str]] = None

def to_dict(self):
    return asdict(self)
