from flask import request, current_app as app

from flask_jwt_extended import create_access_token
import os

@app.route("/api/get_token", methods=["POST"])
def get_token():
    data = request.get_json()
    key = data["key"]

    if key == os.getenv("API_KEY"):
        token = create_access_token(identity=0)
        return token