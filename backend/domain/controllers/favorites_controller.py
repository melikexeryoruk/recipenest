from flask import Blueprint, request, jsonify

from domain.models.favorite import Favorite
from ..models.meal import Meal
from ..services.favorites_service import fetch_favorites_by_userid, create_favorite, delete_favorite, fetch_favorites_objects
from typing import List
from dataclasses import asdict  # <-- toevoegen

fav_bp = Blueprint('fav_bp', __name__)

@fav_bp.get('/favorites/<string:userid>')
def get_favorites(userid):
    try:
        favorites = fetch_favorites_by_userid(userid)
        return jsonify([asdict(fav) for fav in favorites])
    except Exception as e:
        print("favorites_controller - get_favorites -- error", e)
        return jsonify({'error': 'internal server error'}), 500

@fav_bp.post('/favorites/<string:userid>')
def add_favorite(userid):
    try:
        data = request.get_json()
        print("received data: ", data)
        favorite = Favorite(userid=userid, **data)
        created = create_favorite(userid, favorite)
        if created:
            return jsonify(asdict(created)), 201
        else:
            return jsonify({'error': 'Favorite already exists'}), 409
    except Exception as e:
        print("favorites_controller - add_favorite -- error", e)
        return jsonify({'error': 'internal server error'}), 500

@fav_bp.delete('/favorites/<string:userid>/<string:mealid>')
def remove_favorite(userid, mealid):
    try:
        success = delete_favorite(userid, mealid)
        if success:
            return jsonify({'message': 'Favorite removed'}), 200
        else:
            return jsonify({'error': 'Favorite not found'}), 404
    except Exception as e:
        print("favorites_controller - remove_favorite -- error", e)
        return jsonify({'error': 'internal server error'}), 500

@fav_bp.get('/favorites/<string:userid>/details')
def get_favorites_objects(userid):
    try:
        favorites: List[Favorite] = fetch_favorites_by_userid(userid)  
        meal_ids = [fav.mealid for fav in favorites]
        print("meal_ids:", meal_ids)
        meals = fetch_favorites_objects(meal_ids)
        print("meals: ", meals)
        # Maak een dict meal_id -> meal object voor snelle lookup
        meal_map = {meal.id: meal for meal in meals}
        print("meal_map:", meal_map)

        result = []
        for fav in favorites:
            meal_detail = meal_map.get(fav.mealid)
            if meal_detail:
                result.append(asdict(meal_detail))

        print("result: ", result)
        return jsonify(result)

    except Exception as e:
        print("favorites_controller - get_favorites_objects -- error", e)
        return jsonify({'error': 'internal server error'}), 500
