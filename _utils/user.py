from .models import db, Users, Courses, Tags, Enrolled

from flask import request, current_app as app
from flask_jwt_extended import jwt_required

from passlib.hash import sha256_crypt
from email_validator import validate_email, EmailNotValidError


@app.route("/api/user/register", methods=["POST"])
@jwt_required()
def add_user():
    data = request.get_json()
    name = str(data["name"])
    email = str(data["email"]).lower()
    pw = sha256_crypt.hash(data["pw"])

    user = Users(name, email, pw)

    try:
        user.email = validate_email(user.email).normalized
        db.session.add(user)
        try:
            db.session.commit()
        except:
            return f"An account already exists using {email}."

        return f"Account created using {email}."
    except EmailNotValidError:
        return f"Invalid email."


@app.route("/api/user/login", methods=["POST"])
@jwt_required()
def check_user():
    data = request.get_json()

    try:
        email = validate_email(data["email"]).normalized
    except EmailNotValidError:
        return "Invalid email"

    pw = data["pw"]

    check_email = db.session.query(Users).filter(Users.email == email)

    for result in check_email:
        if result:
            check_pw = db.session.query(Users).filter(Users.email == email)

            for result in check_pw:
                if sha256_crypt.verify(pw, result.pw):
                    return "Login successful"
                else:
                    return f"Incorrect password."

    return f"No account exists with {email}."


@app.route("/api/user/delete", methods=["POST"])
@jwt_required()
def delete_user():
    data = request.get_json()
    email = data["email"]
    pw = data["pw"]

    check_email = db.session.query(Users).filter(Users.email == email)

    for result in check_email:
        if result:
            check_pw = db.session.query(Users).filter(Users.email == email)

            for result in check_pw:
                if sha256_crypt.verify(pw, result.pw):
                    db.session.query(Users).filter(Users.email == email).delete()
                    try:
                        db.session.commit()
                        return "Account successfully removed."
                    except:
                        return "There was a problem deleting your account."
                else:
                    return f"Incorrect password."

    return f"No account exists with {email}."


@app.route("/api/user/courses_owned", methods=["POST"])
@jwt_required()
def list_owned_courses():
    data = request.get_json()
    user_id = data["user_id"]

    courses = []
    tags = []

    for course in db.session.query(Courses).filter(Courses.user_id == user_id):
        for user in db.session.query(Users).filter(Users.id == course.user_id):
            name = user.name
        
        for tag in db.session.query(Tags).filter(Tags.course_id == course.course_id):
            tags.append(tag.name)
        
        courses.append({"id": course.course_id, "author": name, "title": course.title, "description": course.description, "tags": tags})

    try:
        return courses
    except:
        return "There was a problem listing the courses."
    

@app.route("/api/user/courses_enrolled", methods=["POST"])
@jwt_required()
def list_enrolled_courses():
    data = request.get_json()
    user_id = data["user_id"]

    courses = []
    tags = []

    for id in db.session.query(Enrolled).filter(Enrolled.user_id == user_id):
        for course in db.session.query(Courses).filter(Courses.course_id == id.course_id):

            for user in db.session.query(Users).filter(Users.id == course.user_id):
                name = user.name
            
            for tag in db.session.query(Tags).filter(Tags.course_id == course.course_id):
                tags.append(tag.name)

            courses.append({"id": course.course_id, "author": name, "title": course.title, "description": course.description, "tags": tags})

    try:
        return courses
    except:
        return "There was a problem listing the courses."