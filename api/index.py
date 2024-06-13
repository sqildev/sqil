import os
import sys

sys.path.insert(0, os.path.abspath(".."))

from utils.models import db

import os
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = os.getenv("FLASK_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("URL")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(days=28)

jwt = JWTManager(app)

db.init_app(app)
migrate = Migrate(app, db)

app.app_context().push()
db.create_all()

from project import user, course, compiler, auth

if __name__ == "__main__":
    app.run()