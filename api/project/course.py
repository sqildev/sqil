from utils.models import db, Users, Courses, Tags

from flask import request, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.jwt import sign_jwt


@app.route("/course", methods=["GET"])
@jwt_required()
def list_courses():
    courses = []
    tags = []

    try:
        user_id = get_jwt_identity()
    except:
        return sign_jwt({"msg": "Unable to identify."}), 400

    for course in db.session.query(Courses).all():
        for user in db.session.query(Users).filter(Users.id == course.user_id):
            name = user.name
        
        for tag in db.session.query(Tags).filter(Tags.course_id == course.course_id):
            tags.append(tag.name)
        
        # Only display courses needing approval if admin
        if "Approving" in tags and user_id == 1:
            courses.append({"id": course.course_id, "author": name, "title": course.title, "description": course.description, "tags": tags})
        
        # Only display private courses if user owns them
        elif "Private" in tags and user_id == course.user_id:
            courses.append({"id": course.course_id, "author": name, "title": course.title, "description": course.description, "tags": tags})
        
        # Display public courses
        elif "Approving" not in tags and "Private" not in tags:
            courses.append({"id": course.course_id, "author": name, "title": course.title, "description": course.description, "tags": tags})
    
    try:
        return sign_jwt({"courses": courses}), 200
    except:
        return sign_jwt({"msg": "There was a problem listing the courses."}), 400


@app.route("/course/tags", methods=["GET"])
def list_tags():
    tags = []

    for tag in db.session.query(Tags).distinct(Tags.name):
        tags.append(tag.name)
    
    try:
        return sign_jwt({"tags": tags}), 200
    except:
        return sign_jwt({"msg": "There was a problem listing the tags."}), 400


@app.route("/course/add", methods=["POST"])
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


@app.route("/course/<int:id>/approve", methods=["POST"])
@jwt_required()
def approve_course(id):
    try:
        user_id = get_jwt_identity()
    except:
        return sign_jwt({"msg": "Unable to identify."}), 400
    
    if user_id == 1:
        db.session.query(Tags).filter(Tags.course_id == id, Tags.name == "Approving").delete()
        db.session.query(Tags).filter(Tags.course_id == id, Tags.name == "Private").delete()
    else:
        return sign_jwt({"msg": "Insufficient privileges."}), 400

    try:
        db.session.commit()
    except:
        return sign_jwt({"msg": "There was a problem approving this course."}), 400
    
    return sign_jwt({"msg": "Course approved successfully."}), 200


@app.route("/course/<int:id>/delete", methods=["DELETE"])
@jwt_required()
def delete_course(id):
    try:
        user_id = get_jwt_identity()
    except:
        return sign_jwt({"msg": "Unable to identify."}), 400
    
    for course in db.session.query(Courses).filter(Courses.course_id == id):
        # If course owner or admin, allowed to delete
        if course.user_id == user_id or user_id == 1:
            db.session.query(Courses).filter(Courses.course_id == id).delete()
        else:
            return sign_jwt({"msg": "Insufficient privileges."}), 400

    try:
        db.session.commit()
    except:
        return sign_jwt({"msg": "There was a problem deleting this course."}), 400
    
    return sign_jwt({"msg": "Course deleted successfully."}), 200


@app.route("/course/<int:id>/tag/add", methods=["POST"])
@jwt_required()
def add_tag(id):
    data = request.get_json()
    try:
        tags = data["tags"]
    except Exception as e:
        return sign_jwt({"msg": "Missing " + str(e)}), 400
    
    try:
        user_id = get_jwt_identity()
    except:
        return sign_jwt({"msg": "Unable to identify."}), 400
    
    for course in db.session.query(Courses).filter(Courses.course_id == id):
        # If course owner or admin, allowed to add tags to this course
        if course.user_id == user_id or user_id == 1:
            for tag in tags:
                db.session.add(Tags(id, tag))
        else:
            return sign_jwt({"msg": "Insufficient privileges."}), 400

    try:
        db.session.commit()
    except:
        return sign_jwt({"msg": "There was a problem adding this tag."}), 400
    
    return sign_jwt({"msg": "Tag added successfully."}), 200


@app.route("/course/<int:id>/tag/delete", methods=["POST"])
@jwt_required()
def delete_tag(id):
    data = request.get_json()
    try:
        tags = data["tags"]
    except Exception as e:
        return sign_jwt({"msg": "Missing " + str(e)}), 400
    
    try:
        user_id = get_jwt_identity()
    except:
        return sign_jwt({"msg": "Unable to identify."}), 400
    
    for course in db.session.query(Courses).filter(Courses.course_id == id):
        # If course owner or admin, allowed to delete tags in this course
        for tag in tags:
            if user_id == 1:
                db.session.query(Tags).filter(Tags.course_id == id, Tags.name == tag).delete()
            # Regular users cannot attempt to publish course themselves
            elif course.user_id == user_id and tag not in ["Private", "Approving"]:
                db.session.query(Tags).filter(Tags.course_id == id, Tags.name == tag).delete()
            
        else:
            return sign_jwt({"msg": "Insufficient privileges."}), 400

    try:
        db.session.commit()
    except:
        return sign_jwt({"msg": "There was a problem deleting this tag."}), 400
    
    return sign_jwt({"msg": "Tag deleted successfully."}), 200