import falcon
from resources import Student, Auth
from auth import AuthMiddleware


api = falcon.API(
    middleware=[AuthMiddleware(excluded_routes=["/auth/google"])]
)

students = Student()



api.add_route('/students', students)
api.add_route('/auth/google', Auth())
