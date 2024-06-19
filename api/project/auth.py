from utils.models import db, Users

from flask import request, current_app as app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from utils.jwt import sign_jwt
from utils.upload import get_extension, upload_file

from passlib.hash import sha256_crypt


@app.route("/api/auth/register", methods=["POST"])
def add_user():
    data = dict(request.form)
    try:
        name = str(data["name"])
        email = str(data["email"]).lower()
        pw = sha256_crypt.hash(data["pw"])
    except Exception as e:
        return sign_jwt({"msg": "Missing " + str(e)}), 400
    
    try:
        pfp = request.files.get("pfp")

        if get_extension(pfp.filename) not in ("jpeg", "jpg", "png"):
            return sign_jwt({"msg": "Invalid file extension for profile picture. Only .jpeg, .jpg, and .png is allowed."}), 400
        
        filename = upload_file(pfp)
    except:
        filename = "default_pfp"
    
    if not filename:
        return sign_jwt({"msg": "A problem occurred uploading the profile picture."}), 400
    
    user = Users(name, email, pw, filename)
    
    db.session.add(user)

    try:
        db.session.commit()
    except:
        return sign_jwt({"msg": f"An account already exists using {email}."}), 400

    token = create_access_token(identity=user.id)
    return sign_jwt({"msg": f"Account created using {email}.", "jwt": token}), 200


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

@app.route("/api/auth/profile", methods=["GET"])
@jwt_required()
def check_session():
    try:
        user_id = get_jwt_identity()
    except:
        return sign_jwt({"msg": "Unable to identify."}), 400
    
    for user in db.session.query(Users).filter(Users.id == user_id):
        name = user.name
        email = user.email

    try:
        return sign_jwt({"msg": "Session successfully verified.", "name": name, "email": email}), 200
    except:
        return sign_jwt({"msg": "There was a problem finding the user."}), 400
