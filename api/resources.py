import json
import logging, sys


log = logging.getLogger(__name__)
log.addHandler(logging.StreamHandler(sys.stdout))
log.setLevel(logging.DEBUG)


class Auth(object):
    def on_post(self, req, resp):
        log.info("Hey!")

        resp.body = json.dumps(["Yo"])


class Student(object):
    def on_get(self, req, resp):
        user = {
            "name": "Emiliano Russo"
        }
        resp.body = json.dumps(user, ensure_ascii=False)
        