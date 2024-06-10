from flask import jsonify

import os
import jwt


def sign_jwt(data: dict):
    token = jwt.encode(data, str(os.getenv("JWT_SIGN")))

    return jsonify({"jwt": token})
