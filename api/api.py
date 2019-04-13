import falcon
from resources import Student


api = falcon.API()


students = Student()

api.add_route('/students', students)