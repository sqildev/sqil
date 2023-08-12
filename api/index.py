import os
import sys
from io import StringIO
from dotenv import load_dotenv

from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from passlib.hash import sha256_crypt
from validate_email import validate_email

from js2py import eval_js

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("URL")
db = SQLAlchemy(app)

class Users(db.Model):
    __tablename__ = "Users"
    
    id = db.Column("id", db.Integer, primary_key=True)
    email = db.Column("email", db.String(320))
    pw = db.Column("pw", db.String(256))

    __table_args__ = (db.UniqueConstraint(email),)

    def __init__(self, email, pw):
        self.email = email
        self.pw = pw

app.app_context().push()
db.create_all()

@app.post("/api/user/register")
def add_user():
    data = request.get_json()
    email = str(data["email"]).lower()
    pw = sha256_crypt.hash(data["pw"])

    user = Users(email, pw)
    
    if validate_email(email, verify=True):
        db.session.add(user)
        try:
            db.session.commit()
        except:
            return f"An account already exists using {email}."
        
        return f"Account created using {email}."
    else:
        return f"Invalid email."

@app.post("/api/user/login")
def check_user():
    data = request.get_json()
    email = data["email"]
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

@app.post("/api/user/delete")
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

@app.post("/api/compiler")
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
            raise "Unsupported language"

    return run(lang, code)
