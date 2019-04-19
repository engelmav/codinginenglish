import falcon
from resources import Student, Auth
from falcon_auth import FalconAuthMiddleware, JWTAuthBackend
import os
import json

current_path = os.path.dirname(os.path.realpath(__file__))

with open(current_path + "/secrets") as s:
    secret = json.loads(s.read())["googleClientSecret"]

user_loader = lambda username, password: { 'username': username }
auth_backend = JWTAuthBackend(user_loader, secret)
auth_middleware = FalconAuthMiddleware(auth_backend,
                    exempt_routes=['/exempt'], exempt_methods=['HEAD'])

api = falcon.API(
    # middleware=[auth_middleware]
)

students = Student()



api.add_route('/students', students)
api.add_route('/test', Auth())
