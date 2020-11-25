import json
import threading
from datetime import time
from time import sleep

import redis
from simplekv.memory.redisstore import RedisStore

from config import config
from database.models import UserModuleRegistration
from services.cie import user_module_registrations_by_user_id

redis_pw = config["cie.redis.password"]
redis_host = config["cie.redis.host"]
red = redis.StrictRedis(host=redis_host, password=redis_pw, port=6379)
redis_store = RedisStore(red)


def pub_to_redis(command_str):
    res = red.publish('cie', command_str)
    return res


def wait_for_session_start(session_id, session_datetime, on_start):
    while True:
        current_time = time.now()
        if current_time == session_datetime:
            event_message = {
                "event_type": "session_start",
                "data": {"session_id": session_id}
            }
            on_start(event_message)


def notify_on_session_start(user_id, session_id, session_start_dt, on_start):
    t = threading.Thread(name=f"notifier-session-user_id:{user_id}-session_id:{session_id}",
                         target=wait_for_session_start, args=[user_id, session_id, session_start_dt, on_start],
                         daemon=True)
    t.start()
    return t

