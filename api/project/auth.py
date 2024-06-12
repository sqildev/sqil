from utils.models import db, Users

from flask import request, current_app as app
from flask_jwt_extended import create_access_token
from utils.jwt import sign_jwt

from passlib.hash import sha256_crypt


@app.route("/api/auth/register", methods=["POST"])
def add_user():
    data = request.get_json()
    try:
        name = str(data["name"])
        email = str(data["email"]).lower()
        pw = sha256_crypt.hash(data["pw"])
    except Exception as e:
        return sign_jwt({"msg": "Missing " + str(e)}), 400

    user = Users(name, email, pw)
    
    db.session.add(user)

    try:
        db.session.commit()
    except:
        return sign_jwt({"msg": f"An account already exists using {email}."}), 400

    return sign_jwt({"msg": f"Account created using {email}."}), 200


@app.route("/api/auth/login", methods=["POST"])
def check_user():
    data = request.get_json()
    try:
        email = data["email"]
        pw = data["pw"]
    except Exception as e:
        return sign_jwt({"msg": "Missing " + str(e)}), 400

    check_email = db.session.query(Users).filter(Users.email == email)

    for result in check_email:
        if result:
            check_pw = db.session.query(Users).filter(Users.email == email)

            for result in check_pw:
                if sha256_crypt.verify(pw, result.pw):
                    token = create_access_token(identity=result.id)
                    return sign_jwt({"msg": "Login successful.", "jwt": token}), 200
                else:
                    return sign_jwt({"msg": "Incorrect password."}), 400

    return sign_jwt({"msg": f"No account exists with {email}."}), 400