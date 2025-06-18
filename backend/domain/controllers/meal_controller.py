from flask import Blueprint, request, jsonify
from ..models.meal import Meal
from ..services.meal_service import fetch_all_meals, create_meal, fetch_meal, update_meal, delete_meal as serv_delete_meal
from typing import List
from dataclasses import asdict  # <-- toevoegen

meal_bp = Blueprint('meal_bp', __name__)

@meal_bp.get('/meals')
def get_meals():
    try:
        meals = fetch_all_meals()
        # Meal-objecten omzetten naar dicts
        return jsonify([asdict(meal) for meal in meals])
    
    except Exception as e:
        print("meal_controller - get_meals --error", e)
        return jsonify({'error': 'internal server error'}), 500

@meal_bp.get('/meals/<string:id>')
def get_meal(id):
    try:
        meal = fetch_meal(id)
        if meal is None:
            return jsonify({'error': 'Meal not found'}), 404
        return jsonify(asdict(meal))  # hier ook omzetten
    
    except Exception as e:
        print("meal_controller - get_meal --error", e)
        return jsonify({'error': 'Internal server error'}), 500

@meal_bp.post('/meals')
def post_meal():
    try:
        data = request.get_json()
        meal = Meal(**data)
        created = create_meal(meal)
        return jsonify(asdict(created)), 201  # ook hier
    
    except Exception as e:
        print("meal_controller - post_meal -- error", e)
        return jsonify({'error': 'internal server error'}), 500

@meal_bp.put('/meals/<string:id>')
def put_meal(id):
    try:
        data = request.get_json()
        data['mealid'] = id  # mealid is onduidelijk, want in model heb je id, geen mealid
        meal = Meal(**data)
        updated = update_meal(meal)
        if updated is None:
            return jsonify({'error': 'Meal not found'}), 404
        return jsonify(asdict(updated)), 200  # ook hier
    
    except Exception as e:
        print("meal_controller - put_meal(meal) -- error", e)
        return jsonify({'error': 'internal server error'}), 500

@meal_bp.delete('/meals/<string:id>')
def delete_meal_controller(id):
    try:
        meal = get_meal(id)
        if meal:
            deleted = serv_delete_meal(id)
            if deleted:
                return jsonify({'message': deleted}), 200
            return jsonify({'error': 'Could not delete meal'}), 500
            
        return jsonify({'error': 'Meal not found'}), 404

    except Exception as e:
        print("meal_controller - delete_meal(id) -- error", e)
        return jsonify({'error': 'internal server error'}), 500
