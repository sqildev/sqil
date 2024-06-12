from flask import request, current_app as app
from flask_jwt_extended import jwt_required
from utils.jwt import sign_jwt

import requests
from time import sleep


@app.route("/api/compiler", methods=["POST"])
@jwt_required()
def compiler():
    data = request.get_json()
    try:
        code = data["code"]
        id = data["id"]
    except Exception as e:
        return sign_jwt({"msg": "Missing " + str(e)}), 400
    
    url = "http://server:2358/submissions"
    post = {
        "source_code": code,
        "language_id": id
    }

    r1 = requests.post(url, post)
    response = r1.json()

    status = ""
    while (status != "Accepted"):
        r2 = requests.get(url + "/" + str(response["token"]))
        status = r2.json()["status"]["description"]
        sleep(0.25)
    
    return sign_jwt(r2.json()), 200