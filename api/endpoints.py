from config import config

from flask import Flask, render_template, jsonify

import hashlib
import hmac
import base64


app = Flask(__name__,
            static_url_path='',
            static_folder='../zoom_frontend',
            template_folder='../zoom_frontend')


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
