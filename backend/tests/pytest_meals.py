import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import app
from domain.controllers.meal_controller import get_meals, get_meal

def test_app():
    assert app is not None

def test_get_all():
    with app.test_client() as client:
        response = client.get('/meals')  # pas route aan indien nodig
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)  # of list, afhankelijk van je API response
        # eventueel asserties op inhoud data


def test_post_meal():
    with app.test_client() as client:
        meal = {
            'name': 'Karni yarik', 'category': 'legume', 'area': 'Turkish',
        }
        response = client.post('/meals', json=meal)
        assert response.status_code == 201 or response.status_code == 200
        data = response.get_json()
        assert 'name' in data and data['name'] == 'Karni yarik'

def test_update_meal():
    with app.test_client() as client:
        # eerst post
        meal = {
            'id': 'meal002',
            'name': 'Makarne',
            'category': 'Pasta',
            'area': 'Italian'
        }
        client.post('/meals', json=meal)

        updated_meal = {
            'id': 'meal002',
            'name': 'Pasta Bolognese',
            'category': 'Pasta',
            'area': 'Italian'
        }
        response = client.put('/meals/meal002', json=updated_meal)
        assert response.status_code == 200
        data = response.get_json()
        assert data['name'] == 'Pasta Bolognese'

def test_get_meal():
    with app.test_client() as client:
        response = client.get('/meals/meal002')
        assert response.status_code == 200
        data = response.get_json()
        assert data['id'] == 'meal002'

def test_delete_meal():
    with app.test_client() as client:
        response = client.delete('/meals/meal002')
        assert response.status_code == 200 or response.status_code == 204
