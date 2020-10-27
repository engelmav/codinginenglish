import datetime

import requests


cie_api = "http://0.0.0.0:5000/api"


def session_start_date(start_date=None):
    if start_date is None:
        start_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {"session_datetime": start_date}


def create_test_user():
    pass


def create_2_hour_session():
    _url = f"{cie_api}/cie-modules/19/sessions"
    resp = requests.post(_url, params={"cie_module_id": 19}, json=session_start_date(),)
    print(resp)
    print(resp.json())


def register_user_to_session():
    user_id = 10
    payload = {"module_session_id": 17}
    _url = f"f{cie_api}/users/{user_id}/module-sessions"
    resp = requests.post(_url, json=payload)
    print(resp)
    print(resp.json())


def delete_session(session_id):
    _url = f"{cie_api}/module_sessions/{session_id}"
    resp = requests.delete(_url)
    print(resp.json())

