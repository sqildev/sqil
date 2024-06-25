from utils.models import db, Users, Courses, Tags, Enrolled

from flask import request, current_app as app
from flask_jwt_extended import jwt_required
from utils.jwt import sign_jwt

from passlib.hash import sha256_crypt


@app.route("/user/<int:id>/courses", methods=["GET"])
@jwt_required()
def list_owned_courses(id):
    courses_owned = []
    tags_owned = []
    courses_enrolled = []
    tags_enrolled = []

    for course in db.session.query(Courses).filter(Courses.user_id == id):
        for user in db.session.query(Users).filter(Users.id == course.user_id):
            name = user.name
        
        for tag in db.session.query(Tags).filter(Tags.course_id == course.course_id):
            tags_owned.append(tag.name)
        
        courses_owned.append({"id": course.course_id, "author": name, "title": course.title, "description": course.description, "tags": tags_owned})

    for id in db.session.query(Enrolled).filter(Enrolled.user_id == id):
        for course in db.session.query(Courses).filter(Courses.course_id == id.course_id):

            for user in db.session.query(Users).filter(Users.id == course.user_id):
                name = user.name
            
            for tag in db.session.query(Tags).filter(Tags.course_id == course.course_id):
                tags_enrolled.append(tag.name)

            courses_enrolled.append({"id": course.course_id, "author": name, "title": course.title, "description": course.description, "tags": tags_enrolled})

    try:
        return sign_jwt({"courses_owned": courses_owned, "courses_enrolled": courses_enrolled}), 200
    except:
        return sign_jwt({"msg": "There was a problem listing the courses."}), 400


@app.route("/user/<int:user_id>/enroll/<int:course_id>", methods=["PUT"])
@jwt_required()
def enroll_course(user_id, course_id):
    enroll = Enrolled(course_id, user_id)
    db.session.add(enroll)

    try:
        db.session.commit()
    except:
        return sign_jwt({"msg": "There was a problem enrolling in this course."}), 400
    
    return sign_jwt({"msg": "Successfully enrolled."}), 200


@app.route("/user/<int:id>/delete", methods=["POST"])
@jwt_required()
def delete_user(id):
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
                    db.session.query(Users).filter(Users.id == id).delete()
                    try:
                        db.session.commit()
                        return sign_jwt({"msg": "Account successfully removed."}), 200
                    except:
                        return sign_jwt({"msg": "There was a problem deleting your account."}), 400
                else:
                    return sign_jwt({"msg": "Incorrect password."}), 400

    return sign_jwt({"msg": f"No account exists with {email}."}), 400