import json
import logging
import threading
from datetime import datetime, timedelta
import time

LOG = logging.getLogger(__name__)


def create_publish_message(redis_client):
    def publish_message(message_str):
        res = redis_client.publish('cie', message_str)
        return res

    return publish_message


def create_event_stream(iterable_stream):
    def event_stream():
        for message in iterable_stream:
            print("Yielding message: ", message)
            message_data = message['data']
            if message_data is not None and type(message_data).__name__ == 'bytes':
                message_data = message_data.decode('utf8')
            event_str = "event: classUpdate\n"
            event_str = event_str + 'data: %s\n\n' % message_data
            yield event_str

    return event_stream


class StudentSessionService:
    def __init__(self, redis, models):
        """
        Watches student sessions and manages what to do when they start and end.
        :param user_id: User ID of the student.
        """
        self.user_id = None
        self.on_start_notifiers = []
        self.redis = redis
        self.models = models

    def get_upcoming_sessions(self):
        results = self._fetch_upcoming_sessions()
        computed_sessions = self._compute_upcoming_sessions(results)
        return computed_sessions

    def _fetch_upcoming_sessions(self):
        """
        Ok, so we only care about classes that
        * haven't started yet
          what does haven't started yet look like? it means that start_dt is in the future.

        * but, what if they already started, and they haven't ended yet? how do we figure that out?
          well, we'd need to know the end date (end_dt).

          so,
              end_dt = start_dt + duration

          so if right now is before (less than) end_dt AND right now is greater than start_dt,
          then you're in the middle of a class.
        """
        m = self.models
        LOG.debug(f"Retrieving module sessions for user id {self.user_id}")
        results = m.UserModuleRegistration \
            .query \
            .join(m.ModuleSession) \
            .filter(m.UserModuleRegistration.user_id == self.user_id) \
            .all()
        return results

    def _compute_upcoming_sessions(self, sessions):
        upcoming_sessions = []
        for session in sessions:
            session_start_dt = session.module_session.session_datetime
            in_progress = self.is_already_started(session_start_dt) \
                and not self.is_ended(session_start_dt)
            is_upcoming = session_start_dt > datetime.now()
            if is_upcoming or in_progress:
                upcoming_sessions.append(
                    {
                        "in_progress": in_progress,
                        "session_id": session.module_session.id,
                        "session_datetime": session_start_dt
                    }
                )
        return upcoming_sessions

    def set_user_id(self, user_id):
        self.user_id = user_id

    def add_on_session_start(self, notifier):
        self.on_start_notifiers.append(notifier)

    def _make_key(self, ):
        return f"user_id_{self.user_id}_session_in_progress"

    def set_session_in_progress(self):
        LOG.debug(f"Setting session_in_progress for user id {self.user_id}")
        self.redis.set(self._make_key(self.user_id), "true")

    def remove_session_in_progress(self):
        self.redis.delete(self._make_key(self.user_id))

    def is_session_in_progress(self):
        key = self.redis.get(self._make_key())
        key_exists = key is not None
        if key_exists:
            return key.decode('utf-8') == "true"
        return False

    def is_already_started(self, session_start_dt):
        now = datetime.now()
        already_started = session_start_dt < now
        return already_started

    def is_ended(self, session_start_dt):
        end_dt = session_start_dt + timedelta(hours=1, minutes=30)
        now = datetime.now()
        ended = now < end_dt
        return ended

    def notify_on_session_start(self, session_id, session_start_dt):
        notifier_task_name = f"notifier-session-user_id:{self.user_id}-session_id:{session_id}"
        LOG.debug(f"Spawning task {notifier_task_name}")
        t = threading.Thread(name=notifier_task_name,
                             target=self.wait_for_session_start, args=[self.user_id, session_id, session_start_dt,
                                                                       self.on_start_notifiers],
                             daemon=True
                             )
        t.start()
        return t

    def wait_for_session_start(self, user_id, session_id, session_start_dt, notifiers):
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
                for notifier in notifiers:
                    notifier(json.dumps(event_message))
            else:
                LOG.debug(f"Not waiting for session {session_id} for user {user_id} with start date {session_start_dt} "
                          f"already_started: {already_started}, ended: {ended}")
                break
            time.sleep(5)
