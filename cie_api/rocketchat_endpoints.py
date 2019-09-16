from flask import Blueprint, jsonify, request, session
from services.rocketchat_service import RocketChatService
from config import config
from operator import itemgetter
from flask_cors import cross_origin


rocketchat = Blueprint('rocketchat_endpoints', __name__)

username, password, api_url = itemgetter(
    "cie.rocketchat.user",
    "cie.rocketchat.password",
    "cie.rocketchat.api_url"
)(config)

rocketchat_service = RocketChatService(username, password, api_url)


@rocketchat.route('/rocketchat/login', methods=['POST'])
def login_rocketchat_user():
    """
    Receives Profile data from auth0 login and passes it to RocketChat service.
    :return:
    """
    req = request.get_json()
    name, email = itemgetter(
        "name", "email"
    )(req['authData']['idTokenPayload'])
    resp = rocketchat_service.create_or_login_user(
        email.replace('@', 'at').replace('.', 'dot'), # username
        name,
        email,
        'FakePassword' # password
    )

    return jsonify({'rocketchatAuthToken': resp['data']['authToken']})


@rocketchat.route('/rocket_chat_auth_get')
@cross_origin(origins="http://localhost:3000")
def get_auth_token():
    if ('user' in session and 'rocketchatAuthToken' in session['user']):
        return jsonify(
            {
                'loginToken': session['user']['rocketchatAuthToken']
            }
        )
    else:
        return jsonify({'message': 'User not logged in (rocket_chat_auth_get).'}), 401


@rocketchat.route('/rocket_chat_iframe')
@cross_origin(origins="http://localhost:3000")
def login_token_event():
    if 'user' in session and 'rocketchatAuthToken' in session['user']:
        auth_token = session['user']['rocketchatAuthToken']
        chat_server = api_url
        return_script = \
            "<script>window.parent.postMessage({ event: 'login-with-token', loginToken: '%s' }, '%s');</script>" % \
                (auth_token, chat_server)
        return jsonify(return_script)
    else:
        return 'User not logged in (rocket_chat_iframe).', 401


