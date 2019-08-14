import os
import json


secrets_path = os.getenv("CIE_SECRETS",
                         os.path.dirname(os.path.realpath(__file__))
                         )


with open(secrets_path + "/secrets.json") as s:
    config = json.loads(s.read())


session_opts = {
    'session.type': 'memory',
    'session.cookie_expires': 300,
    'session.auto': True
}