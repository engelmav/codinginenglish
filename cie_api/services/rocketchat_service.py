from config import config
from urllib.parse import urljoin

import requests


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
        resp = self.session.post('/api/v1/login', json={
            "user": username,
            "password": password
        })
        resp_json = resp.json()
        headers = {
            'X-Auth-Token': resp_json["data"]["authToken"],
            'X-User-Id': resp_json["data"]["userId"]
        }
        self.session.headers.update(headers)

    def _get(self, uri):
        resp = self.session.get(uri)
        return resp.json()

    def _post(self, uri):
        resp = self.session.post(uri)
        return resp.json()

    def user_list(self):
        return self._get('/api/v1/users.list')

    def user_create(self, user_data):
        return self._post('/api/v1/users.create')


