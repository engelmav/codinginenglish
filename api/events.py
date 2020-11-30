import json
import logging
import threading
from datetime import datetime, timedelta
import time
import redis
from simplekv.memory.redisstore import RedisStore

from config import config
from database.models import UserModuleRegistration
from services.cie import user_module_registrations_by_user_id

redis_pw = config["cie.redis.password"]
redis_host = config["cie.redis.host"]
red = redis.StrictRedis(host=redis_host, password=redis_pw, port=6379)
redis_store = RedisStore(red)


LOG = logging.getLogger(__name__)


def pub_to_redis(command_str):
    res = red.publish('cie', command_str)
    return res


def wait_for_session_start(user_id, session_id, session_start_dt, on_start):
    while True:
        now = datetime.now()
        session_end_dt = session_start_dt + timedelta(hours=1, minutes=30)
        already_started = session_start_dt < now
        still_going = now < session_end_dt
        session_in_progress = already_started and still_going

        if session_in_progress:
            # todo: add check "not previous alerted"; requires persistence
            event_message = {
                "event_type": "session_start",
                "data": {"session_id": session_id, "user_id": user_id}
            }
            LOG.debug(f"Calling on_start callback for event {str(event_message)}")
            on_start(json.dumps(event_message))
        else:
            LOG.debug(f"Not waiting for session {session_id} for user {user_id} with start date {session_start_dt} already_started: {already_started}, still_going: {still_going}")
            break
        time.sleep(5)


def notify_on_session_start(user_id, session_id, session_start_dt, on_start):
    notifier_task_name = f"notifier-session-user_id:{user_id}-session_id:{session_id}"
    LOG.debug(f"Spawning task {notifier_task_name}")
    t = threading.Thread(name=notifier_task_name,
                         target=wait_for_session_start, args=[user_id, session_id, session_start_dt, on_start],
                         daemon=True)
    t.start()
    return t

