from flask import jsonify

import os
from jose import jwe, jwt


def create_jwt(data: dict):
    token = jwt.encode(data, str(os.getenv("JWT_SIGN")))
    encrypted = jwe.encrypt(token, str(os.getenv("JWT_ENCRYPT")), algorithm="dir", encryption='A256GCM')

    return jsonify({"jwt": str(encrypted)})