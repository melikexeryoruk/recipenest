from flask import Flask
from flask_cors import CORS
from domain.controllers.meal_controller import meal_bp
from domain.controllers.auth_controller import auth_bp
from domain.controllers.favorites_controller import fav_bp
from domain.controllers.planning_controller import plan_bp
import os
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS", "").split(",")

CORS(app, origins=FRONTEND_ORIGINS)


app.register_blueprint(meal_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(fav_bp)
app.register_blueprint(plan_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 8000)), debug=False)

