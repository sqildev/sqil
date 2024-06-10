from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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
