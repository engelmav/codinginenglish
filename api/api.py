import falcon
from resources import Student, Auth
from auth import AuthMiddleware
from beaker.middleware import SessionMiddleware
from config import session_opts


api = falcon.API(
    middleware=[
        # AuthMiddleware(excluded_routes=["/auth/google"])
    ]
)

students = Student()

api.add_route('/students', students)
api.add_route('/auth/google', Auth())


api = SessionMiddleware(api, session_opts, environ_key="user.session")



