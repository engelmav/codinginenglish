from flask import Blueprint, jsonify, request, session, render_template
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


@rocketchat.route('/login', methods=['POST'])
def login_rocketchat_user():
    # https: // mohammedlakkadshaw.com / blog / embedding - rocket - chat - using - iframe - auth.html /
    user = request.get_json()

    username, name, email, password = itemgetter(
        "username", "name", "email", "password"
    )(user)
    resp = rocketchat_service.create_or_login_user(username, name, email, password)

    user['rocketchatAuthToken'] = resp['data']['authToken']
    user['rocketchatUserId'] = resp['data']['userId']

    session['user'] = user

    return jsonify({'message': 'Login successful!'})


@rocketchat.route('/rocket_chat_auth_get')
@cross_origin(origins="https://codinginenglish.rocketchat.com")
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
@cross_origin(origins="https://codinginenglish.rocketchat.com")
def login_token_event():
    # if 'user' in session and 'rocketchatAuthToken' in session['user']:
    #     auth_token = session['user']['rocketchatAuthToken']
    #     chat_server = api_url
    #     return_script = \
    #         "<script>window.parent.postMessage({ event: 'login-with-token', loginToken: '%s' }, '%s');</script>" % \
    #             (auth_token, chat_server)
    #     return jsonify(return_script)
    # else:
    #     return 'User not logged in (rocket_chat_iframe).', 401
    return render_template('rocketchat_login.html')

