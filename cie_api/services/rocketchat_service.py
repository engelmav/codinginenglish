from config import config
from urllib.parse import urljoin
import json

import requests
from requests.exceptions import HTTPError


api_url = config['cie.rocketchat.api_url']
username = config['cie.rocketchat.user']
password = config['cie.rocketchat.password']


class SessionB(requests.Session):
    def __init__(self, url_base=None, *args, **kwargs):
        super(SessionB, self).__init__(*args, **kwargs)
        self.url_base = url_base

    def request(self, method, url, **kwargs):
        modified_url = urljoin(self.url_base, url)
        return super(SessionB, self).request(method, modified_url, **kwargs)


class RocketChatService(requests.Session):
    LOGIN_URI = '/api/v1/login'
    def __init__(self, username, password, api_url):
        self.session = None
        self._authenticate(username, password, api_url)

    def _authenticate(self, username, password, api_url):
        """
        Create requests session with base url, obtain token
        and add to session for subsequent requests
        :return: None
        """
        self.session = SessionB(api_url)
        resp = self.session.post(RocketChatService.LOGIN_URI, json={
            "user": username,
            "password": password
        })
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

    def create_or_login_user(self, username, name, email, password):
        user = self.get_user(username)
        if len(user['users']) == 0:
            # user doesn't exist - create it!
            user = self.create_user(username, name, email, password)
        return self.login_user(email, password)
