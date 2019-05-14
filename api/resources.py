import json
import logging, sys
from jose import jwk
from jose.utils import base64url_decode
from falcon import Request, Response
from auth import verify_gtoken


log = logging.getLogger(__name__)
log.addHandler(logging.StreamHandler(sys.stdout))
log.setLevel(logging.DEBUG)


class Auth(object):
    def __init__(self, jwt_authenticator=None):
        pass
    def on_post(self, req: Request, resp: Response):
        log.info("Hey!")
        token = json.load(req.bounded_stream)['token']

        user_data = verify_gtoken(token)

        log.info("We made it {}".format(str(user_data)))
        resp.set_cookie("cookie", "cookie value")


        resp.body = json.dumps(["Yo"])




class Student(object):
    def on_get(self, req, resp):
        user = {
            "name": "Emiliano Russo"
        }
        resp.body = json.dumps(user, ensure_ascii=False)

        