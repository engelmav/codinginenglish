from flask import Blueprint, jsonify
from services.rocketchat_service import RocketChatService
from config import config
from operator import itemgetter


rocketchat = Blueprint('rocketchat_endpoints', __name__)

username, password, api_url = itemgetter(
    "cie.rocketchat.user",
    "cie.rocketchat.password",
    "cie.rocketchat.api_url"
)(config)

rocketchat_service = RocketChatService(username, password, api_url)


@rocketchat.route('/rocketchat/users', methods=['GET'])
def get_users():
    res = rocketchat_service.user_list()
    return jsonify(res)

@rocketchat.route('/rocket_chat_auth_get')
def get_auth_token():
    ...
    # https://pythonhosted.org/Flask-Session/
    # https://mohammedlakkadshaw.com/blog/embedding-rocket-chat-using-iframe-auth.html/