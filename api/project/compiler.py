from flask import request, current_app as app
from flask_jwt_extended import jwt_required
from utils.jwt import sign_jwt

import requests
from time import sleep


@app.route("/compiler", methods=["POST"])
@jwt_required()
def compiler():
    data = request.get_json()
    try:
        code = data["code"]
        id = data["id"]
    except Exception as e:
        return sign_jwt({"msg": "Missing " + str(e)}), 400

    stdin = ""
    try:
        stdin = data["stdin"]
    except:
        pass
    
    url = "http://127.0.0.1:2358/submissions"
    post = {
        "source_code": code,
        "language_id": id,
        "stdin": stdin
    }

    r1 = requests.post(url, post)
    response = r1.json()

    output = {}
    status = "In Queue"
    while (status in ("In Queue", "Processing")):
        r2 = requests.get(url + "/" + str(response["token"]))
        status = r2.json()["status"]["description"]
        output = r2.json()
        sleep(0.25)
    
    return sign_jwt(output), 200