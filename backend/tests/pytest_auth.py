import pytest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import app

def test_register_new_user():
    client = app.test_client()
    response = client.post("/register", json={
        "email": "test12334@example.com",
        "password": "test1234"
    })

    assert response.status_code == 201
    data = response.get_json()
    assert data["email"] == "test12334@example.com"
    assert "password" in data

def test_register_existing_user():
    client = app.test_client()

    client.post("/register", json={
        "email": "testduplicate@example.com",
        "password": "secret"
    })

    response = client.post("/register", json={
        "email": "testduplicate@example.com",
        "password": "secret"
    })

    assert response.status_code == 409
    assert response.get_json()["error"] == "Email already exists"

def test_login_valid_user():
    client = app.test_client()

    client.post("/register", json={
        "email": "logintest@example.com",
        "password": "mypassword"
    })

    response = client.post("/login", json={
        "email": "logintest@example.com",
        "password": "mypassword"
    })

    assert response.status_code == 200
    data = response.get_json()
    assert "token" in data

def test_login_invalid_password():
    client = app.test_client()

    client.post("/register", json={
        "email": "wrongpass@example.com",
        "password": "correctpass"
    })

    response = client.post("/login", json={
        "email": "wrongpass@example.com",
        "password": "incorrectpass"
    })

    assert response.status_code == 401
    assert response.get_json()["error"] == "Invalid credentials"
