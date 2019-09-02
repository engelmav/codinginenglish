from config import config
from urllib.parse import urljoin

import requests
from requests.auth import AuthBase


api_url = config['cie.rocketchat.api_url']
username = config['cie.rocketchat.user']
password = config['cie.rocketchat.password']


class RocketChatAuth(AuthBase):
    """
    Purpose of this class is to insert the auth token on every request.
    TODO: determine token expiry.
    """
    def __init__(self, username, password):
        self.full_url = urljoin(api_url, '/api/v1/login')
        resp = requests.post(self.full_url, json={
            "user": username,
            "password": password
        })
        resp_json = resp.json()
        self.token = resp_json["data"]["authToken"]
        self.user_id = resp_json["data"]["userId"]


    def __call__(self, r):
        """
        Attatch an API token to custom header
        :param r: the request object
        :return: the request object
        """
        r.headers['X-TokenAuth'] = self.token
        r.headers['X-User-Id'] = self.user_id
        return r

    def user_list(self):
        ...




