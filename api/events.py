import json
import logging
import threading
from datetime import datetime, timedelta
import time

from app_context import red

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
            LOG.debug(f"Not waiting for session {session_id} for user {user_id} with start date {session_start_dt} "
                      f"already_started: {already_started}, still_going: {still_going}")
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

