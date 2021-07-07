from config import config
from urllib.parse import urljoin

import requests

import logging


api_url = config['cie.rocketchat.api_url']
username = config['cie.rocketchat.user']
password = config['cie.rocketchat.password']
LOG = logging.getLogger(__name__)


class SessionB(requests.Session):
    def __init__(self, url_base=None, *args, **kwargs):
        super(SessionB, self).__init__(*args, **kwargs)
        self.url_base = url_base

    def request(self, method, url, **kwargs):
        modified_url = urljoin(self.url_base, url)
        return super(SessionB, self).request(method, modified_url, **kwargs)


class RocketChatService:
    LOGIN_URI = '/api/v1/login'

    def __init__(self):
        self.session = None
        self._authenticate(username, password, api_url)

    def _authenticate(self, username, password, api_url):
        """
        Create requests session with base url, obtain token
        and add to session for subsequent requests
        :return: None
        """
        self.session = SessionB(api_url)
        try:
            resp = self.session.post(RocketChatService.LOGIN_URI, json={
                "user": username,
                "password": password
            })
        except requests.exceptions.RequestException as e:
            LOG.error("Unable to authenticate with RocketChatService. Leaving down.")
            return
        resp_json = resp.json()
        headers = {
            'X-Auth-Token': resp_json["data"]["authToken"],
            'X-User-Id': resp_json["data"]["userId"]
        }
        self.session.headers.update(headers)

    def _get(self, uri, params=None):
        resp = self.session.get(uri, params=params)
        return resp.json()

    def _post(self, uri, json=None):
        resp = self.session.post(uri, json=json)
        return resp.json()

    def get_user(self, username):
        resp = self._get(
            # requests' urlencoding with a params arg causes double backslash escaping, which the API doesn't like
            '/api/v1/users.list?fields={ "username":1 }&query={ "username": "%s" }' % username)
        return resp

    def get_user_by_email(self, email):
        user = self._get('/api/v1/users.list?fields={ "username":1 }&query={"emails":{"$elemMatch": {"address" : {"$eq":"%s"}}}}' % email)
        return user.get("users")[0]

    def users(self):
        return self._get("/api/v1/users.list")

    def create_user(self, username, name, email, password):
        resp = self._post('/api/v1/users.create',
                          json={
                              "name": name,
                              "email": email,
                              "password": password,
                              "username": username
                          })
        return resp

    def delete_user(self, username):
        resp = self._post('/api/v1/users.delete',
                          json={
                              "username": username
                          })
        return resp

    def login_user(self, email, password):
        resp = self._post(RocketChatService.LOGIN_URI, json={
            "user": email,
            "password": password
        })
        return resp

    def create_auth_token(self, user_id):
        user_token = self._post("/api/v1/users.createToken", {"userId": user_id})
        return user_token

    def create_or_login_user(self, username, name, email, password):
        user = self.get_user(username)
        if len(user['users']) == 0:
            # user doesn't exist - create it!
            user = self.create_user(username, name, email, password)
        return self.login_user(email, password)

    def login_with_auth0(self, auth0_access_token, auth0_secret):
        resp = self._post('/api/v1/login',
                          {"serviceName": "auth0", "accessToken": auth0_access_token,
                           "secret": "hash", "expiresIn": 200})

        return resp

    def create_channel(self, channel_name, users=None):
        if users is None:
            members = []
        else:
            members = users
        resp = self._post('/api/v1/channels.create',
                          {"name": channel_name, "members": members})
        return resp

    def add_user_to_channel(self, user_id, channel_id=None, channel_name=None):
        """
        curl -H "X-Auth-Token: 9HqLlyZOugoStsXCUfD_0YdwnNnunAJF8V47U3QHXSq" \
        -H "X-User-Id: aobEdbYhXfu5hkeqG" \
        -H "Content-type: application/json" \
     http://localhost:3000/api/v1/channels.invite \
     -d '{ "roomId": "ByehQjC44FwMeiLbX", "userId": "nSYqWzZ4GsKTX4dyK" }'
        :param users:
        :return:
        """
        if channel_id is None and channel_name:
            channel_info = self.channel_info(channel_name)
            channel_id = channel_info.get("channel").get("_id")
        resp = self._post('/api/v1/channels.invite',
                          {"roomId": channel_id, "userId": user_id})
        return resp

    def delete_channel(self, channel_name):
        resp = self._post('/api/v1/channels.delete',
                          {"roomName": channel_name})
        return resp

    def channel_info(self, channel_name):
        resp = self._get('/api/v1/channels.info',
                          {"roomName": channel_name})
        return resp

    def remove_user_from_channel(self, user_id, channel_id=None, channel_name=None):
        if channel_id is None and channel_name:
            channel_info = self.channel_info(channel_name)
            channel_id = channel_info.get("channel").get("_id")

        resp = self._post('/api/v1/channels.kick',
                          {"roomId": channel_id, "userId": user_id})
        return resp
