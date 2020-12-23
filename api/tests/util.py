import datetime

import requests


cie_api = "http://0.0.0.0:5000/api"
test_user_id = 10


def session_start_date(start_date=None):
    if start_date is None:
        start_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {"session_datetime": start_date}


def create_2_hour_session():
    _url = f"{cie_api}/cie-modules/19/sessions"
    resp = requests.post(_url, params={"cie_module_id": 19}, json=session_start_date())
    session_id = resp.json().get('data').get('id')
    print(f"created_2_hour_session(): session_id {session_id}")
    return session_id


def register_user_to_session(user_id, session_id):
    payload = {"module_session_id": session_id}
    _url = f"{cie_api}/users/{user_id}/module-sessions"
    resp = requests.post(_url, json=payload)
    registered_session = resp.json().get('data').get('id')
    print(f"register_user_to_session(): Registered session {registered_session}")
    return registered_session


def setup_live_test_session():
    session_id = create_2_hour_session()
    register_user_to_session(test_user_id, session_id)


def delete_session(session_id):
    _url = f"{cie_api}/module_sessions/{session_id}"
    resp = requests.delete(_url)
    print(resp.json())

