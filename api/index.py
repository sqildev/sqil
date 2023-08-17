import os
import sys
from io import StringIO
from dotenv import load_dotenv

from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from passlib.hash import sha256_crypt
from email_validator import validate_email, EmailNotValidError

from js2py import eval_js

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("URL")
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Users(db.Model):
    __tablename__ = "Users"

    id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column("name", db.String(320))
    email = db.Column("email", db.String(320))
    pw = db.Column("pw", db.String(256))

    __table_args__ = (db.UniqueConstraint(email),)

    def __init__(self, name, email, pw):
        self.name = name
        self.email = email
        self.pw = pw

class Courses(db.Model):
    __tablename__ = "Courses"

    course_id = db.Column("course_id", db.Integer, primary_key=True)
    user_id = db.Column("user_id", db.Integer)
    title = db.Column("title", db.String(70))
    description = db.Column("description", db.String(1000))

    __table_args__ = (db.UniqueConstraint(user_id, title, description),)

    def __init__(self, user_id, title, description):
        self.user_id = user_id
        self.title = title
        self.description = description

class Tags(db.Model):
    __tablename__ = "Tags"

    id = db.Column("id", db.Integer, primary_key=True)
    course_id = db.Column("course_id", db.Integer)
    name = db.Column("name", db.String(20))

    __table_args__ = (db.UniqueConstraint(course_id, name),)

    def __init__(self, course_id, name):
        self.course_id = course_id
        self.name = name

class Enrolled(db.Model):
    __tablename__ = "Enrolled"

    id = db.Column("id", db.Integer, primary_key=True)
    course_id = db.Column("course_id", db.Integer)
    user_id = db.Column("user_id", db.Integer)

    __table_args__ = (db.UniqueConstraint(course_id, user_id),)

    def __init__(self, course_id, user_id):
        self.course_id = course_id
        self.user_id = user_id

app.app_context().push()
db.create_all()


@app.route("/api/user/register", methods=["POST"])
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


@app.route("/api/compiler", methods=["POST"])
def compiler():
    data = request.get_json()
    lang = data["language"]
    code = data["code"]

    def run(lang, code):
        output = StringIO()
        sys.stdout = output

        if lang == "py":
            try:
                exec(code)
                return {"stdout": str(output.getvalue()), "stderr": ""}
            except Exception as e:
                return {"stdout": "", "stderr": str(e)}

        elif lang == "js":
            try:
                eval_js(code)
                return {"stdout": str(output.getvalue()), "stderr": ""}
            except Exception as e:
                return {"stdout": "", "stderr": str(e)}

        else:
            return "Unsupported language"

    return run(lang, code)

if __name__ == "__main__":
    app.run(debug=True)