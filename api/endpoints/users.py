from flask import Blueprint, request

def get(key, default=None):
    j = request.get_json()
    return j.get(key, default)


users = Blueprint('users_endpoints', __name__)


@users.route('/users', methods=['POST'])
def create_user():
    ...
