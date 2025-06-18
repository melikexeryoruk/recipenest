import jwt
import datetime
import bcrypt
from ..models.user import User
from ..repos.auth_repo import get_user_by_email
from flask import current_app
import os

SECRET_KEY = os.getenv("JWT_SECRET", "39847-103947-2834987-2039847-09827340-8172304710-23847")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user: User):
    payload = {
        'userid': user.userid,
        'email': user.email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
