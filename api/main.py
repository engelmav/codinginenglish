from flask import Flask, render_template, jsonify, request, Blueprint
import flask
from flask_kvsession import KVSessionExtension
from simplekv.memory.redisstore import RedisStore

import hashlib
import hmac
import base64

import redis

import database.models as m
from rocketchat_endpoints import rocketchat
from payment_endpoints import stripe_bp
from config import config
from database.models import User

from operator import itemgetter

app = Flask(__name__,
            static_url_path='',
            static_folder='../zoom_frontend',
            template_folder='../zoom_frontend')

app.register_blueprint(rocketchat)
app.register_blueprint(stripe_bp)
app.secret_key = config["cie.api.session.key"]


@app.teardown_appcontext
def shutdown_session(exception=None):
    m.db_session.remove()


red = redis.StrictRedis()
redis_store = RedisStore(red)

KVSessionExtension(redis_store, app)

ZOOM_API_KEY = config["cie.zoom.apikey"]
ZOOM_SECRET = config["cie.zoom.apisecret"]


def generate_signature(data, ts):
    msg = data['apiKey'] + str(data['meetingNumber']) + str(ts) + str(data['role'])
    message = base64.b64encode(bytes(msg, 'utf-8'))
    secret = bytes(data['apiSecret'], 'utf-8')
    hash = hmac.new(secret, message, hashlib.sha256)
    hash = base64.b64encode(hash.digest())
    hash = hash.decode("utf-8")
    tmpString = "%s.%s.%s.%s.%s" % (data['apiKey'], str(data['meetingNumber']), str(ts), str(data['role']), hash)
    signature = base64.b64encode(bytes(tmpString, "utf-8"))
    signature = signature.decode("utf-8")
    return signature.rstrip("=")


def event_stream():
    pubsub = red.pubsub()
    pubsub.subscribe('cie')
    for message in pubsub.listen():
        print("Yielding message: ", message)
        message_data = message['data']
        if message_data != None and type(message_data).__name__ == 'bytes':
            message_data = message_data.decode('utf8')
        yield 'data: %s\n\n' % message_data


def _get(key, default=None):
    j = request.get_json()
    return j.get(key, default)


def serialize(data, clazz, many=False):
    schema = clazz(many=many)
    return jsonify(schema.dump(data).data)


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
    j = request.get_json()
    for obj in j:
        inst = m.CieModuleSchema().make_instance(obj)
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


@app.route('/api/module-session/<session_id>/users', methods=['POST'])
def add_users_to_session(session_id):
    j = request.get_json()
    user_id = j['user_id']
    user = m.User.query.filter_by(id=user_id).one()
    sess = m.ModuleSession.query.filter_by(id=session_id).one()
    m.add_user(user, sess)


@app.route('/api/module-sessions')
def get_modules():
    res = m.ModuleSession.query.all()
    return serialize(res, m.ModuleSessionSchema, many=True)


@app.route('/api/users', methods=['POST'])
def create_user():
    ...


@app.route('/api/send', methods=['POST'])
def send_sse():
    j = request.get_json(force=True)
    message = j['message']
    res = red.publish('cie', message)
    return jsonify(res)


@app.route('/api/stream')
def stream_sse():
    stream_message = event_stream()
    sse_message = flask.Response(stream_message, mimetype="text/event-stream")
    print("/stream is returning", sse_message)
    return sse_message


@app.route('/api/profile')
def login():
    """
    Captures user profile information for use in RocketChat and settings.
    :return:
    """
    req = request.get_json()
    given_name, family_name, email = itemgetter(
        "given_name", "family_name", "email"
    )(req['idTokenPayload'])

    user = User(
        firstname=given_name,
        lastname=family_name,
        email=email
    )
    return jsonify({})


@app.route('/api/zoom/signature/<meeting_number>/<ts>')
def get_signature(meeting_number, ts):
    data = {'apiKey': ZOOM_API_KEY,
            'apiSecret': ZOOM_SECRET,
            'meetingNumber': meeting_number,
            'role': 0}

    signature = generate_signature(data, ts)

    return jsonify({
        "apiKey": ZOOM_API_KEY,
        "signature": signature
    })


@app.route('/api/zoom/current', )
def set_current_zoom():
    pass


@app.route("/api/site-map")
def site_map():
    links = []
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        # if has_no_empty_params(rule):
        links.append({"methods": list(rule.methods), "url": rule.rule})
    return jsonify(links)
