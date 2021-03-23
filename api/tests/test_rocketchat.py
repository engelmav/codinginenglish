from services.rocketchat import RocketChatService
from config import config

from operator import itemgetter
from urllib.parse import urljoin
import uuid

import pytest


username, password, api_url = itemgetter(
        "cie.rocketchat.user",
        "cie.rocketchat.password",
        "cie.rocketchat.api_url"
    )(config)


def _uuid():
    return str(uuid.uuid4())[:8]


@pytest.fixture(scope="module")
def rocketchat_service():
    r = RocketChatService(username, password, api_url)
    return r

def test_auth_headers():

    _json = {
        "status": "success",
        "data": {
            "userId": "romanosofia",
            "authToken": "vienenpronto"
        }
    }

    r = RocketChatService('user', 'pass', )
    assert r.session.headers['X-TokenAuth'] == "vienenpronto"
    assert r.session.headers['X-User-Id'] == "romanosofia"


def test_get_user(rocketchat_service):
    res = rocketchat_service.get_user("TestUzerSuperUniqueName")
    assert res['users'][0]['_id'] == 'anDSjEGYoYnoAyvYf'


def test_login(rocketchat_service):
    test_user_passwd = config["cie.rocketchat.testuser.password"]
    res = rocketchat_service.login_user("TestUzerSuperUniqueName2", test_user_passwd)
    assert res['data']['userId'] == 'nDfTdKcBiGquhRYQ8'


def test_attempt_login_no_user(rocketchat_service):
    res = rocketchat_service.create_or_login_user(
        "Never Existed User", "Some Name", "noone@nowhere.com", "easypass")


def test_create_user(rocketchat_service):
    current_uuid = _uuid()
    username = f'testuser{current_uuid}'
    name = f'testuser name {current_uuid}'
    email= f'{username}@testuser.com'
    passwd = f'fakepassword{current_uuid}'
    res = rocketchat_service.create_user(username, name, email, passwd)


def test_create_channel(rocketchat_service):
    test_channel_name = "testchannel"
    resp_create = rocketchat_service.create_channel(test_channel_name)
    # assert resp
    assert resp_create["channel"]["name"] == test_channel_name
    resp_delete = rocketchat_service.delete_channel(test_channel_name)
    assert resp_delete["success"] is True
    print(resp_create, resp_delete)
