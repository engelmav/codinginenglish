import json
import logging
import threading
from datetime import datetime, timedelta
import time

from app_context import red
from services.cie import is_session_in_progress

LOG = logging.getLogger(__name__)


def pub_to_redis(command_str):
    res = red.publish('cie', command_str)
    return res


class StudentSessionManager:
    def __init__(self, user_id):
        """
        Watches student sessions and manages what to do when they start and end.
        :param user_id: User ID of the student.
        """
        self.user_id = user_id
        self.on_start_notifiers = []

    def add_on_session_start(self, notifier):
        self.on_start_notifiers.append(notifier)

    def is_already_started(self, session_start_dt):
        now = datetime.now()
        already_started = session_start_dt < now
        return already_started

    def is_ended(self, session_start_dt):
        end_dt = session_start_dt + timedelta(hours=1, minutes=30)
        now = datetime.now()
        ended = now < end_dt
        return ended

    def notify_on_session_start(self, session_id, session_start_dt, on_start):
        notifier_task_name = f"notifier-session-user_id:{self.user_id}-session_id:{session_id}"
        LOG.debug(f"Spawning task {notifier_task_name}")
        t = threading.Thread(name=notifier_task_name,
                             target=self.wait_for_session_start, args=[self.user_id, session_id, session_start_dt,
                                                                       on_start],
                             daemon=True)
        t.start()
        return t

    def wait_for_session_start(self, user_id, session_id, session_start_dt):
        while True:
            already_started = self.is_already_started(session_start_dt)
            ended = self.is_ended(session_start_dt)
            session_in_progress = already_started and not ended

            if session_in_progress:
                event_message = {
                    "event": "student-session-manager",
                    "event_type": "session_start",
                    "data": {"session_id": session_id, "user_id": user_id}
                }
                LOG.debug(f"Calling on_start callback for event {str(event_message)}")
                for notifier in self.on_start_notifiers:
                    notifier(json.dumps(event_message))
            else:
                LOG.debug(f"Not waiting for session {session_id} for user {user_id} with start date {session_start_dt} "
                          f"already_started: {already_started}, ended: {ended}")
                break
            time.sleep(5)


