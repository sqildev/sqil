import os
import sys

sys.path.insert(0, os.path.abspath(".."))

from utils.models import db

import os
from dotenv import load_dotenv

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required

import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = os.getenv("FLASK_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("URL")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(days=28)
app.config['MAX_CONTENT_LENGTH'] = 8 * 1000 * 1000
app.config['UPLOAD_FOLDER'] = "./files"

jwt = JWTManager(app)

db.init_app(app)
migrate = Migrate(app, db)

app.app_context().push()
db.create_all()

from project import user, course, compiler, auth

@app.route("/files/<path:path>", methods=["GET"])
@jwt_required()
def send_file(path):
    return send_from_directory("files", path)

if __name__ == "__main__":
    app.run()