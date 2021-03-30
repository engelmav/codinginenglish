from datetime import datetime, timezone, timedelta
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
test_user_id = 10  #17


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


def session_start_date_now():
    start_date = datetime.now(timezone.utc)
    start_date_utc = start_date.astimezone(timezone.utc)
    start_date_str = start_date_utc.strftime("%Y-%m-%d %H:%M:%S")
    return {"session_datetime": start_date_str}


def session_start_date_now():
    start_date = datetime.now(timezone.utc)

    start_date_utc = start_date.astimezone(timezone.utc)
    start_date_str = start_date_utc.strftime("%Y-%m-%d %H:%M:%S")
    return {"session_datetime": start_date_str}


def create_2_hour_session(module_id, session_start_dt):
    session_start_dt_str = session_start_dt.strftime("%Y-%m-%d %H:%M:%S")
    _url = f"{config.current_url}/cie-modules/{module_id}/sessions"
    resp = requests.post(_url, params={"cie_module_id": module_id}, json={"session_datetime": session_start_dt_str})
    session_id = resp.json().get('data').get('id')
    print(f">>>> created_2_hour_session(): session_id {session_id}")
    pp.pprint(resp.json())
    return resp.json()


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


def users():
    # TODO: make users GET endpoint
    _url = f"{config.current_url}/users"
    resp = requests.get(_url)
    print(f" **** Users")
    pp.pprint(resp.json())
    return resp.json()


def create_user_active_session(user_id, module_session_id):
    url = f"{config.current_url}/module-sessions/{module_session_id}/active-sessions"
    resp = requests.post(
        url,
        json={"students": [user_id],
              "teachers": [],
              "prezzie_link": "https://slides.com/vincentengelmann/basic_session_02/live"}
    )
    print(f" **** User active session:")
    pp.pprint(resp.json())
    return resp.json()


def create_chat_channel(channel_name):
    url = f"{config.current_url}/rocketchat/channel.create"
    resp = requests.post(url, json={"channelName": channel_name})
    print(f" **** Chat channel created:")
    pp.pprint(resp.json())
    return resp.json()


def delete_test_data():
    # TODO: create delete methods
    pass


def user_sessions(user_id):
    _url = f"{config.current_url}/users/{user_id}/module-sessions"
    resp = requests.get(_url)
    print(f" **** User sessions for user_id {user_id}")
    pp.pprint(resp.json())
    return resp.json()


def create_test_data(test_data_spec, add_user_to_session=True, activate_session=True):
    session_start_date = test_data_spec.get("session_start_date")
    module_data = create_beginners_module()
    test_data.module_id = module_data.get('data').get('id')

    session_data = create_2_hour_session(test_data.module_id, session_start_date)
    if add_user_to_session:
        test_data.session_id = session_data.get('data').get('id')
        register_user_to_session(test_user_id, test_data.session_id)
        if activate_session:
            test_data.active_session = create_user_active_session(
                test_user_id, test_data.session_id)
            test_data.chat_channel_name = test_data.active_session["data"]["active_session"]["chat_channel"]
            channel_json = create_chat_channel(test_data.chat_channel_name)
            print(channel_json)


def session_start_date_5_days_from_now():
    now = datetime.now(timezone.utc)
    five_days = timedelta(days=5)
    five_hours_from_now = now + five_days
    return five_hours_from_now


def create_test_data_session_in_progress():
    test_data_spec = {
        "session_start_date": session_start_date_now()
    }
    create_test_data(test_data_spec)


def create_test_data_session_in_5_days():
    test_data_spec = {
        "session_start_date": session_start_date_5_days_from_now()
    }
    create_test_data(test_data_spec, add_user_to_session=False, activate_session=False)





