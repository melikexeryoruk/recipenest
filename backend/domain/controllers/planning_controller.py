
from dataclasses import asdict
import uuid
from flask import Blueprint, jsonify, request

from domain.models.planning import Planning
from domain.services.planning_service import add_planning, get_plannings, remove_planning, update_planning


plan_bp = Blueprint('plan_bp', __name__)


@plan_bp.get('/plans/<string:userid>')
def get_plans(userid):
    try:
        favorites = get_plannings(userid)
        return jsonify([asdict(fav) for fav in favorites])
    except Exception as e:
        print("favorites_controller - get_favorites -- error", e)
        return jsonify({'error': 'internal server error'}), 500


@plan_bp.post('/plans/<string:userid>')
def post_planning(userid):
    try:
        data = request.get_json()
        
        if not isinstance(data, list):
            return jsonify({'error': 'Expected a list of planning items'}), 400

        planning_items = []

        for item in data:
            # Genereer een unieke id als die ontbreekt
            if 'id' not in item:
                item['id'] = str(uuid.uuid4())
            # Voeg de userid toe aan elke planning
            item['userid'] = userid

            planning = Planning(**item)
            planning_items.append(planning)

        created_plans = add_planning(userid, planning_items)

        return jsonify([asdict(plan) for plan in created_plans]), 201

    except Exception as e:
        print("planning_controller - post_planning -- error", e)
        return jsonify({'error': 'Internal server error'}), 500



@plan_bp.delete('/plans/<string:userid>/<string:planid>')
def remove_plan(userid, planid):
    try:
        success = remove_planning(userid, planid)
        if success:
            return jsonify({'message': 'Favorite removed'}), 200
        else:
            return jsonify({'error': 'Favorite not found'}), 404
    except Exception as e:
        print("favorites_controller - remove_favorite -- error", e)
        return jsonify({'error': 'internal server error'}), 500

@plan_bp.put('/plans/<string:userid>/update/<string:planid>')
def put_plan(userid, planid):
    try:
        data = request.get_json()
        data['userid'] = userid
        data['id'] = planid
        plan = Planning(**data)
        updated = update_planning(userid, planid, plan)
        if updated is None:
            return jsonify({'error': 'Plan not found'}), 404
        return jsonify(asdict(updated)), 200
    except Exception as e:
        print("planning_controller - put_plan(meal) -- error", e)
        return jsonify({'error': 'internal server error'}), 500
