from config import config

from flask import Flask, render_template, jsonify, request
import flask

import hashlib
import hmac
import base64

import redis


app = Flask(__name__,
            static_url_path='',
            static_folder='../zoom_frontend',
            template_folder='../zoom_frontend')

red = redis.StrictRedis()


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
        print(message)
        yield 'data: %s\n\n' % message['data']

# https://lincolnloop.com/blog/architecting-realtime-applications/
# https://stackoverflow.com/questions/12232304/how-to-implement-server-push-in-flask-framework/12236019
# https://github.com/jakubroztocil/chat/blob/master/app.py
@app.route('/send', methods=['POST'])
def send_sse():
    j = request.get_json(force=True)
    res = red.publish('cie', j['message'])
    return jsonify(res)


@app.route('/stream')
def stream_sse():
    return flask.Response(event_stream(), mimetype="text/event-stream")


@app.route('/',)
def get_index():
    return render_template('index.html')


@app.route('/zoom/signature/<meeting_number>/<ts>')
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



@app.route("/site-map")
def site_map():
    links = []
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        # if has_no_empty_params(rule):
        links.append({"methods": list(rule.methods), "url": rule.rule})
    return jsonify(links)
