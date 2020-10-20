import datetime

import requests


cie_api = "0.0.0.0:5000"
url = f"http://{cie_api}/api/cie-modules/19/sessions"


def session_start_date(start_date=None):
    if start_date is None:
        start_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {"session_datetime": start_date}


def create_2_hour_session():
    resp = requests.post(url, params={"cie_module_id": 19}, json=session_start_date(),)
    print(resp)
    print(resp.json())

