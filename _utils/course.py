from .models import *

from flask import request, current_app as app


@app.route("/api/course/add", methods=["POST"])
def add_course():
    data = request.get_json()
    user_id = data["user_id"]
    title = data["title"]
    description = data["description"]
    tags = data["tags"]

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
        return "There was a problem creating this course."
    
    return "Course created successfully."

 
@app.route("/api/course/enroll", methods=["POST"])
def enroll_course():
    data = request.get_json()
    course_id = data["course_id"]
    user_id = data["user_id"]

    enroll = Enrolled(course_id, user_id)
    db.session.add(enroll)

    try:
        db.session.commit()
    except:
        return "There was a problem enrolling in this course."
    
    return "Successfully enrolled."


@app.route("/api/course/list", methods=["GET"])
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
        return courses
    except:
        return "There was a problem listing the courses."


@app.route("/api/course/tags", methods=["GET"])
def list_tags():
    tags = []

    for tag in db.session.query(Tags).distinct(Tags.name):
        tags.append(tag.name)
    
    return tags