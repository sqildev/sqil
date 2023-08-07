import os
import subprocess
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import sha256_crypt
from validate_email import validate_email

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

@app.post("/api/register")
def add_user():
    data = request.get_json()
    email = data["email"]
    pw = sha256_crypt.encrypt(data["pw"])

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

@app.post("/api/login")
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

@app.post("/api/delete")
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
    language = data["language"]
    filename = data["filename"]
    code = data["code"]

    path = "/../../../tmp/" + filename

    def deleteFiles():
        for f in os.listdir("/../../../tmp/"):
            os.remove(os.path.join("/../../../tmp/", f))
    
    def run(command: str, compile=""):        
        if compile:
            compile_result = subprocess.run(
                compile.split(),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            if compile_result.stderr:
                deleteFiles()
                return {"stdout": "", "stderr": compile_result.stderr.decode()}
        
        result = subprocess.run(
            command.split(),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        deleteFiles()

        return {"stdout": result.stdout.decode(), "stderr": result.stderr.decode()}
    
    file = f"{path}.{language}"

    f = open(file, "x")
    f.close()

    with open(file, "w") as f:
        f.write(code + "\n")
    
    if language == "py":
        return run(f"python {file}")
    elif language == "js":
        return run(f"node {file}")
    elif language == "c":
        return run(path + ".exe", compile=f"gcc {file} -o {path}.exe")
    elif language == "cpp":
        return run(path + ".exe", compile=f"g++ {file} -o {path}.exe")
    else:
        deleteFiles()
        return "Unsupported programming language provided."
