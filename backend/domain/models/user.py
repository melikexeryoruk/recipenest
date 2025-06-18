from dataclasses import asdict, dataclass
from typing import List, Optional


@dataclass
class User:
    userid: str
    email: str
    password: str
    id: Optional[str] = None    
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = "user"


    @classmethod
    def from_cosmos(cls, doc: dict):
        allowed_keys = {'id', 'userid', 'email', 'password'}
        filtered = {k: doc[k] for k in allowed_keys if k in doc}
        return cls(**filtered)


def to_dict(self):
    return asdict(self)