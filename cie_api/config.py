import os
import json
import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
logger = logging.getLogger(__name__)

secrets_path = os.getenv("CIE_SECRETS",
                         os.path.dirname(os.path.realpath(__file__))
                         )

env = os.getenv('CIE_ENV', 'local')

logger.info(f"CIE ENV {env}")

with open(secrets_path + "/secrets.json") as s:
    config = json.loads(s.read())[env]


session_opts = {
    'session.type': 'memory',
    'session.cookie_expires': 300,
    'session.auto': True
}