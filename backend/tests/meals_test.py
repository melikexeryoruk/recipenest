###### meals_test.py

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import app
from domain.controllers.meal_controller import get_meals, get_meal, post_meal, put_meal

def test_app():
    assert app is not None
    print("App import test passed!")

def test_get_all(): 
    items = get_meals()
    print(items)

def test_post_meal():
    with app.test_client() as client:
        meal = {
            'name': 'Karni yarik', 'category': 'legume', 'area': 'Turkish',
        }
        output = client.post('/meals', json=meal)
        print(output.status_code)
        print(output.get_json())

# def test_update_meal():
#     with app.test_client() as client:
#         meal = {
#             'id':'meal001','mealid':'meal001', 'name':'Pasta Pesto', 'category':'Pasta', 'area':'Italian'
#         }
#         mealid = meal['mealid']
#         output = client.put(f'/meal/{mealid}', json=meal)
#         print(output.status_code)
#         print(output.get_json())

def test_update_meal():
    with app.test_client() as client:
        # Eerst POST (maak de meal aan)
        meal = {
            'id': 'meal002',
            'name': 'Makarne',
            'category': 'Pasta',
            'area': 'Italian',
            'source': 'idk'
        }
        client.post('/meals', json=meal)

        # Nu update (PUT)
        updated_meal = {
            'id': 'meal002',
            'name': 'Pasta Bolognese',  # aangepast
            'category': 'Pasta',
            'area': 'Italian',
            'source': 'idk'
        }
        output = client.put('/meals/meal002', json=updated_meal)
        print(output.status_code)
        print(output.get_json())


def test_get_meal(id: str):
    with app.test_client() as client:
        output = client.get(f'/meals/{id}')
        print(output.status_code)
        print(output.get_json())

def test_delete_meal(id: str):
    with app.test_client() as client:
        output = client.delete(f'/meals/{id}')
        print(output.status_code)
        print(output.get_json())



if __name__ == "__main__":
    test_app()
    # test_get_all()
    # test_post_meal()
    # test_get_meal('meal001')
    # test_update_meal()
    # test_get_meal('meal001')
    # test_delete_meal('meal002')