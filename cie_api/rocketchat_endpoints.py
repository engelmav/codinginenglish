from flask import Blueprint, jsonify
from services.rocketchat_service import RocketChatService
from config import config
from operator import itemgetter
from flask_session import Session


rocketchat = Blueprint('rocketchat_endpoints', __name__)

Session(rocketchat)

username, password, api_url = itemgetter(
    "cie.rocketchat.user",
    "cie.rocketchat.password",
    "cie.rocketchat.api_url"
)(config)

rocketchat_service = RocketChatService(username, password, api_url)


@rocketchat.route('/login')
def login_rocketchat_user():



@rocketchat.route('/rocket_chat_auth_get')
def get_auth_token():

    # https://pythonhosted.org/Flask-Session/
    # https://mohammedlakkadshaw.com/blog/embedding-rocket-chat-using-iframe-auth.html/
