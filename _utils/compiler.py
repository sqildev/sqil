from flask import request, current_app as app
from .jwt import create_jwt

import requests


@app.route("/api/compiler", methods=["POST"])
def compiler():
    data = request.get_json()
    code = data["code"]
    id = data["id"]
    
    url = "http://localhost:2358/submissions"
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
    
    return create_jwt(r2.json()), 200