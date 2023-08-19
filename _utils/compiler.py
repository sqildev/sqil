from flask import request, current_app as app

import sys
from io import StringIO
from js2py import eval_js


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