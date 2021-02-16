import datetime
import pprint

import requests


pp = pprint.PrettyPrinter(indent=2)


class Environ:
    prod = "http://0.0.0.0:5050/api"
    local = "http://0.0.0.0:5000/api"


class Config:
    def __init__(self):
        self.current_url = None


class TestData:
    test_user_id = None
    module_id = None
    session_id = None
    test_user_registration_id = None


config = Config()
test_data = TestData()

config.current_url = None
test_user_id = 10


def site_map():
    resp = requests.get(f"{config.current_url}/site-map")
    print(resp)
    if resp.status_code not in [200, 201]:
        print(f"Received error code {resp.status_code}")
    pp.pprint(resp.json())
    return resp


def set_prod():
    config.current_url = Environ.prod


def set_local():
    config.current_url = Environ.local


def create_module(module_data):
    _url = f"{config.current_url}/modules"
    resp = requests.post(_url, json=module_data)
    print(">>>> Created CIE module")
    print(resp)
    pp.pprint(resp.json())
    return resp.json()


def modules():
    url = f"{config.current_url}/modules"
    print(f"url {url}")
    resp = requests.get(url)
    print(resp)
    pp.pprint(resp.json())
    return resp


def session_start_date(start_date=None):
    if start_date is None:
        start_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {"session_datetime": start_date}


def create_2_hour_session(module_id):
    _url = f"{config.current_url}/cie-modules/19/sessions"
    resp = requests.post(_url, params={"cie_module_id": module_id}, json=session_start_date())
    session_id = resp.json().get('data').get('id')
    print(f">>>> created_2_hour_session(): session_id {session_id}")
    pp.pprint(resp.json())
    return session_id


def register_user_to_session(user_id, session_id):
    payload = {"module_session_id": session_id}
    _url = f"{config.current_url}/users/{user_id}/module-sessions"
    resp = requests.post(_url, json=payload)
    registered_session_id = resp.json().get('data').get('id')
    print(f" **** Registered user {user_id} to session {registered_session_id}")
    pp.pprint(resp.json())
    return resp.json()


def setup_live_test_session():
    session_id = create_2_hour_session()
    register_user_to_session(test_user_id, session_id)


def delete_session(session_id):
    _url = f"{config.current_url}/module_sessions/{session_id}"
    resp = requests.delete(_url)
    print(f" **** Deleted session ID {session_id}")
    pp.pprint(resp.json())
    print(resp.json())


def create_beginners_module():
    payload = {
        "name": "WebApp Development - Basic Course",
        "description": "In this course, we bring you on a three month journey, with a customer, coworkers, and a product designer. We add features, fix bugs, and program fullstack. You will learn the basics of ReactJS, CSS, Python, Linux, and Github.",
    }
    module_data = create_module(payload)
    return module_data


def create_2_hour_session(module_id):
    _url = f"{config.current_url}/cie-modules/{module_id}/sessions"
    resp = requests.post(_url, json=session_start_date())
    print(f" **** Created 2 hour session")
    pp.pprint(resp.json())
    return resp.json()


def users():
    # TODO: make users GET endpoint
    _url = f"{config.current_url}/users"
    resp = requests.get(_url)
    print(f" **** Users")
    pp.pprint(resp.json())
    return resp.json()


def create_test_data():
    module_data = create_beginners_module()
    test_data.module_id = module_data.get('data').get('id')

    session_data = create_2_hour_session(test_data.module_id)
    test_data.session_id = session_data.get('data').get('id')
    register_user_to_session(test_user_id, test_data.session_id)


def delete_test_data():
    # TODO: create delete methods
    pass


def user_sessions(user_id):
    _url = f"{config.current_url}/users/{user_id}/module-sessions"
    resp = requests.get(_url)
    print(f" **** User sessions for user_id {user_id}")
    pp.pprint(resp.json())
    return resp.json()


