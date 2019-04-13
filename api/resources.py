import json


class Student(object):
    def on_get(self, req, resp):
        user = {
            "name": "Emiliano Russo"
        }
        resp.body = json.dumps(user, ensure_ascii=False)
        