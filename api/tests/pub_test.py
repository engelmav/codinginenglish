import time
import requests

while True:
    requests.get('http://localhost:5000/ping1', json={
        "test": "message text"
    })
    time.sleep(1)
