import os
import json



current_path = os.path.dirname(os.path.realpath(__file__))

with open(current_path + "/secrets.json") as s:
    config = json.loads(s.read())