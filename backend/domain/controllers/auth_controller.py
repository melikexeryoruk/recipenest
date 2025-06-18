from flask import Blueprint, request, jsonify
from ..models.user import User
from ..services.auth_service import hash_password, verify_password, create_token
from ..repos.auth_repo import get_user_by_email, create_user
from dataclasses import asdict

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.post("/register")
def register():
    data = request.get_json()
    existing = get_user_by_email(data['email'])
    if existing:
        return jsonify({'error': 'Email already exists'}), 409

    user = User(userid="", email=data['email'], password=hash_password(data['password']))
    created = create_user(user)
    return jsonify(asdict(created)), 201

@auth_bp.post("/login")
def login():
    data = request.get_json()
    user = get_user_by_email(data['email'])
    if not user or not verify_password(data['password'], user.password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = create_token(user)
    return jsonify({'token': token}, user)
