from flask import Flask, jsonify, request
import flask
import redis
from sqlalchemy import and_
from flask_kvsession import KVSessionExtension
from simplekv.memory.redisstore import RedisStore

import json

import database.models as m
from payment.endpoints import stripe_bp
from config import config
from database.models import User
from services.cie import get_module_session_by_id, create_partial_user


from operator import itemgetter
import logging

LOG = logging.getLogger(__name__)
app = Flask(__name__,
            static_url_path='',
            static_folder='../zoom_frontend',
            template_folder='../zoom_frontend')

app.register_blueprint(stripe_bp)
app.secret_key = config["cie.api.session.key"]
redis_pw = config["cie.redis.password"]
redis_host = config["cie.redis.host"]


@app.teardown_appcontext
def shutdown_session(exception=None):
    m.db_session.remove()


red = redis.StrictRedis(host=redis_host, password=redis_pw, port=6379)
redis_store = RedisStore(red)

KVSessionExtension(redis_store, app)


def event_stream():
    pubsub = red.pubsub()
    pubsub.subscribe('cie')
    for message in pubsub.listen():
        print("Yielding message: ", message)
        message_data = message['data']
        if message_data is not None and type(message_data).__name__ == 'bytes':
            message_data = message_data.decode('utf8')
        event_str = "event: classUpdate\n"
        event_str = event_str + 'data: %s\n\n' % message_data
        yield event_str


# MESSAGING TO FRONTEND
@app.route('/api/send', methods=['POST'])
def send_sse():
    command = request.get_json()
    # we are doing this twice to clean up control characters
    command_str = json.dumps(command)
    res = red.publish('cie', command_str)
    return jsonify(res)


@app.route('/api/stream')
def stream_sse():
    stream_message = event_stream()
    sse_message = flask.Response(
        stream_message,
        mimetype="text/event-stream",
    )
    # the below header tells any proxy not to compress server-sent events (SSEs) - useful for Webpack DevServer
    sse_message.headers['Cache-Control'] = "no-transform"
    # the below header prevents nginx from swallowing SSEs.
    sse_message.headers['X-Accel-Buffering'] = "no"
    return sse_message


def _get(key, default=None):
    j = request.get_json()
    return j.get(key, default)


def serialize(data, clazz, many=False):
    """
    JSON-serialize a SQLAlchemy instance using a corresponding Marshmallow schema.
    :param data: an instance of a SQLAlchemy model
    :param clazz: the schema class corresponding to the SQLAlchemy model
    :param many: bool. many or single.
    :return: json string
    """
    schema = clazz(many=many)
    return jsonify(schema.dump(data))


def deserialize(data, clazz):
    schema = clazz()
    loaded = schema.load(data)
    return loaded.data


@app.route('/api/modules', methods=['POST'])
def create_modules():
    """
    [
        {
            "name": "Dev Teams and Loops",
            "description": "Development teams, roles, salaries"
        }
    ]
    :return:
    {
    "description": "value",
    "id": 6,
    "name": "value"
}
    """
    inst = m.CieModuleSchema().make_instance(request.get_json())
    inst.add()
    return serialize(inst, m.CieModuleSchema)


@app.route('/api/cie-modules/<cie_module_id>/sessions', methods=['POST'])
def add_session_to_module(cie_module_id):
    """
    {
        "session_datetime": "2020-05-20 18:00:00"
    }
    :param cie_module_id: str. integer id of module.
    :return: ModuleSessionSchema object.
    """
    sess = m.ModuleSession(cie_module_id=cie_module_id, session_datetime=_get('session_datetime'))
    new_sess = sess.add()
    return serialize(new_sess, m.ModuleSessionSchema)


@app.route('/api/module-sessions')
def get_modules():
    res = m.ModuleSession.query.all()
    return serialize(res, m.ModuleSessionSchema, many=True)


@app.route('/api/users', methods=['POST'])
def add_user():
    # TODO: pair down to what we need for unique user identification.
    """
    {
      "accessToken": "<access token>",
      "idToken": "<id token>",
      "idTokenPayload": {
        "given_name": "Vincent",
        "family_name": "Engelmann",
        "nickname": "vincent.engelmann1",
        "name": "Vincent Engelmann",
        ...
      },
      ...
      "expiresIn": 7200,
      "tokenType": "Bearer",
      "scope": "openid profile email"
    }
    Captures users logged on via Auth0 for use in registration and view permissions.
    This will NOT register a user for a module, only create a user record.
    :return:
    """

    req = request.get_json()
    given_name, family_name, email = itemgetter(
        "given_name", "family_name", "email"
    )(req['idTokenPayload'])
    existing_user = User.query.filter(
        and_(
            User.firstname == given_name,
            User.lastname == family_name,
            User.email == email)
    ).one_or_none()

    if existing_user:
        LOG.warning("User with email {} exists already, returning".format(existing_user.email))
        return serialize(existing_user, m.UserSchema)

    _user = User(
        firstname=given_name,
        lastname=family_name,
        email=email
    )
    _user.add()
    LOG.info("New user registered with email address: {}".format(_user.email))

    return serialize(_user, m.UserSchema)


@app.route('/api/users/<int:user_id>/module-sessions', methods=['GET'])
def get_user_sessions(user_id):
    """
    Get the sessions for which a user is registered.
    :return:
    """
    registered_modules = User.query.filter_by(id=user_id).one().registered_modules
    return serialize(registered_modules, m.UserModuleRegistrationSchema, many=True)


@app.route('/api/users/<int:user_id>/module-sessions', methods=['POST'])
def register_user_to_session(user_id):
    """
    Register a user to a session with a pre-created user ID.
    """
    user = User.query.filter_by(id=user_id).one()
    module_session_json = request.get_json()
    module_session = get_module_session_by_id(module_session_json.get('module_session_id'))
    user.add_to_module_session(module_session)
    return jsonify(success=True)


class PartialUser:
    email: str
    fullname: str


class UncreatedUserRegistration:
    partial_user: PartialUser
    module_session_id: int


@app.route('/api/users/<str:email>/module-sessions', methods=['POST'])
def register_uncreated_user_to_session(email):
    """
    Register an uncreated user to a session, using his or her email.
    """
    fullname = _get("fullname")
    module_session_id = _get('module_session_id')
    _user = create_partial_user(fullname, email)
    module_session_json = request.get_json()
    module_session = get_module_session_by_id()
    _user.add_to_module_session(module_session)
    LOG.info(f"Registered user with email {email} to module session {module_session_id}")
    return jsonify(success=True)


@app.route("/api/site-map")
def site_map():
    links = []
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        # if has_no_empty_params(rule):
        links.append({"methods": list(rule.methods), "url": rule.rule})
    return jsonify(links)
