import falcon
from resources import Student
from falcon_auth import FalconAuthMiddleware, BasicAuthBackend


user_loader = lambda username, password: { 'username': username }
auth_backend = BasicAuthBackend(user_loader)
auth_middleware = FalconAuthMiddleware(auth_backend,
                    exempt_routes=['/exempt'], exempt_methods=['HEAD'])

api = falcon.API(middleware=[auth_middleware])

students = Student()

api.add_route('/students', students)
