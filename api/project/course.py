from utils.models import db, Users, Courses, Tags

from flask import request, current_app as app
from flask_jwt_extended import jwt_required
from utils.jwt import sign_jwt


@app.route("/api/course", methods=["GET"])
def list_courses():
    courses = []
    tags = []

    for course in db.session.query(Courses).all():
        for user in db.session.query(Users).filter(Users.id == course.user_id):
            name = user.name
        
        for tag in db.session.query(Tags).filter(Tags.course_id == course.course_id):
            tags.append(tag.name)
        
        courses.append({"id": course.course_id, "author": name, "title": course.title, "description": course.description, "tags": tags})
    
    try:
        return sign_jwt({"courses": courses}), 200
    except:
        return sign_jwt({"msg": "There was a problem listing the courses."}), 400


@app.route("/api/course/tags", methods=["GET"])
def list_tags():
    tags = []

    for tag in db.session.query(Tags).distinct(Tags.name):
        tags.append(tag.name)
    
    try:
        return sign_jwt({"tags": tags}), 200
    except:
        return sign_jwt({"msg": "There was a problem listing the tags."}), 400


@app.route("/api/course/add", methods=["POST"])
@jwt_required()
def add_course():
    data = request.get_json()
    try:
        user_id = data["user_id"]
        title = data["title"]
        description = data["description"]
        tags = data["tags"]
    except Exception as e:
        return sign_jwt({"msg": "Missing " + str(e)}), 400

    course = Courses(user_id, title, description)
    db.session.add(course)

    course_id = 0
    for result in db.session.query(Courses).all():
        if result.course_id > course_id:
            course_id = result.course_id

    for tag in tags:
        db.session.add(Tags(course_id, tag))

    try:
        db.session.commit()
    except:
        return sign_jwt({"msg": "There was a problem creating this course."}), 400
    
    return sign_jwt({"msg": "Course created successfully."}), 200