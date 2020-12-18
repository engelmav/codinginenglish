import threading

from flask import Flask, jsonify, request, session
import flask

import json

import database.models as m
from events import pub_to_redis, StudentSessionManager
from app_context import red
from payment.payment_api import stripe_bp
from config import config
from database.models import User
import services.cie as cie

from operator import itemgetter
import logging

LOG = logging.getLogger(__name__)
app = Flask(__name__,
            static_url_path='',
            static_folder='../zoom_frontend',
            template_folder='../zoom_frontend')

app.register_blueprint(stripe_bp)
app.secret_key = config["cie.api.session.key"]


@app.teardown_appcontext
def shutdown_session(exception=None):
    m.db_session.remove()


# @app.after_request
def after_request_func(response):
    data = json.loads(response.get_data())
    user_id = session.get('user_id')
    if user_id is None:
        LOG.warning('No user_id stored in Flask session. Unable to lookup class session in progress.')
        return response
    data['show_class_link'] = cie.is_session_in_progress(user_id)
    response.set_data(json.dumps(data))
    return response


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
    res = pub_to_redis(command_str)

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
    return jsonify(status="success", data=schema.dump(data),
                   messages="Object(s) created successfully.")


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
    LOG.debug(f"Adding session of date {_get('session_datetime')} to cie_module_id {cie_module_id}")
    _session = m.ModuleSession(cie_module_id=cie_module_id, session_datetime=_get('session_datetime'))
    _session.add()
    LOG.debug(f"Session added: {_session}")
    return serialize(_session, m.ModuleSessionSchema)


@app.route('/api/module_sessions/<session_id>', methods=['DELETE'])
def delete_session_from_module(session_id):
    _session = m.ModuleSession.query(id=session_id).one()
    _session.delete()
    return jsonify(
        status="success",
        messages=["Deleted session"]
    )


@app.route('/api/module-sessions')
def get_modules():
    res = m.ModuleSession.query.all()
    return serialize(res, m.ModuleSessionSchema, many=True)


@app.route('/api/users', methods=['POST'])
def initialize_user():
    """
    Initializes a user. This involves user creation if necessary, or returning
    a known existing user based on "given name" and "family name", both Auth0
    User object fields. Will also return whether the user currently has a class that
    is in session.
    :return: UserSchema
    """
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
    _user = cie.create_user(email, first_name=given_name, last_name=family_name)
    user_id = _user.id
    registrations = cie.get_upcoming_sessions_by_user_id(user_id)
    for reg in registrations:
        session_start_time = reg.module_session.session_datetime
        session_id = reg.module_session.id
        student_session_mgr = StudentSessionManager(_user.id)
        student_session_mgr.add_on_session_start(pub_to_redis)
        StudentSessionManager.notify_on_session_start(session_id, session_start_time)

    in_session = cie.is_session_in_progress(user_id)
    schema = m.UserSchema()
    return jsonify(status="success", data=dict(user=schema.dump(_user), is_in_session=in_session),
                   messages=f"User initialized {user_id} successfully.")


@app.route('/api/threads', methods=['GET'])
def get_threads():
    threads = []
    for thread in threading.enumerate():
        threads.append(thread.name)
    return jsonify(threads)


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
    LOG.debug(f"register_user_to_session(): Looking up user_id {user_id}")
    user = User.query.filter_by(id=user_id).one()
    module_session_json = request.get_json()
    LOG.debug(f"register_user_to_session(): Looking up module_session_id {module_session_json.get('module_session_id')}")
    module_session = cie.get_module_session_by_id(module_session_json.get('module_session_id'))

    user_reg = user.add_to_module_session(module_session)

    LOG.debug(f"Registering student id {user.id} to module_session id {module_session}")

    session_id = user_reg.module_session_id
    session_start_dt = user_reg.module_session.session_datetime

    def handle_session_start(session_start_message):
        """
        If session already marked as in progress, do not emit message.
        The web client will rely on Redis state.
        :param session_start_message:
        :return:
        """
        if cie.is_session_in_progress(user.id):
            return
        cie.set_session_in_progress(user.id)
        pub_to_redis(session_start_message)

    notify_on_session_start(user.id, session_id, session_start_dt, on_start=handle_session_start)

    return serialize(user_reg, m.UserModuleRegistrationSchema)


@app.route("/api/site-map")
def site_map():
    links = []
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        # if has_no_empty_params(rule):
        links.append({"methods": list(rule.methods), "url": rule.rule})
    return jsonify(links)
