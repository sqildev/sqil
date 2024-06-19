from flask import current_app as app
import os
import uuid
from werkzeug.utils import secure_filename

extensions = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions


def get_extension(filename):
    if '.' in filename:
        return filename.rsplit('.', 1)[1].lower()
    else:
        return None


def upload_file(file):
    if file.filename == '':
        return None
    elif secure_filename(file.filename) in [name for name in os.listdir(app.config['UPLOAD_FOLDER'])]:
        unique_str = str(uuid.uuid4())[:8]
        file.filename = f"{unique_str}_{file.filename}"
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        try:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return filename
        except:
            return None
    else:
        return None
