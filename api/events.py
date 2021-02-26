import json
import logging
import threading
from datetime import datetime, timedelta, timezone
import pytz
import time


LOG = logging.getLogger(__name__)


class Event:
    def __init__(self, event_type, message):
        self.event_type = event_type
        self.message = message

    def __str__(self):
        return (
            f"event: {self.event_type}\ndata: {self.message}\n\n"
        )


def create_publish_message(redis_client):
    def publish_message(message_str):
        LOG.debug(f"Publishing message on cie channel: {message_str}")
        res = redis_client.publish('cie', message_str)
        return res

    return publish_message


class ThreadSafeIter:
    """Takes an iterator/generator and makes it thread-safe by
    serializing call to the `next` method of given iterator/generator.
    https://anandology.com/blog/using-iterators-and-generators/
    """

    def __next__(self):
        with self.lock:
            return self.generator.__next__()

    def __init__(self, generator):
        self.generator = generator
        self.lock = threading.Lock()

    def __iter__(self):
        return self

    def next(self):
        with self.lock:
            return self.generator.next()


def create_event_stream(red):
    def event_stream():
        # todo: pull the next two lines back out to make this testable.
        pubsub = red.pubsub()
        pubsub.subscribe('cie')
        for message in pubsub.listen():
            message_data = message['data']
            if message_data is not None and type(message_data).__name__ == 'bytes':
                message_data = message_data.decode('utf8')
            event = Event("student-session-manager", message_data)
            LOG.debug(f"Emitting event {str(event)}")
            yield str(event)

    # thread_safe_event_stream = ThreadSafeIter(event_stream())
    # return thread_safe_event_stream
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
            already_started = self.is_already_started(session_start_dt)
            ended = self.is_ended(session_start_dt)
            in_progress = already_started and not ended
            is_upcoming = session_start_dt > datetime.now(timezone.utc)
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

    def _make_key(self):
        return f"user_id_{self.user_id}_session_in_progress"

    def set_session_in_progress(self):
        LOG.debug(f"Setting session_in_progress for user id {self.user_id}")
        self.redis.set(self._make_key(), "true")

    def remove_session_in_progress(self):
        self.redis.delete(self._make_key())

    def is_session_in_progress(self):
        key = self.redis.get(self._make_key())
        key_exists = key is not None
        if key_exists:
            return key.decode('utf-8') == "true"
        return False

    def is_already_started(self, session_start_dt):
        now = datetime.now(timezone.utc)
        already_started = session_start_dt < now
        return already_started

    def is_ended(self, session_start_dt):
        end_dt = session_start_dt + timedelta(hours=1, minutes=30)
        now = datetime.now(timezone.utc)
        ended = now > end_dt
        return ended

    def notify_on_session_start(self, session_id, session_start_dt):
        notifier_task_name = f"notifier-session-user_id:{self.user_id}-session_id:{session_id}"
        LOG.debug(f"Spawning task {notifier_task_name} for user {self.user_id}")
        t = threading.Thread(name=notifier_task_name,
                             target=self.wait_for_session_start, args=[self.user_id, session_id, session_start_dt,
                                                                       self.on_start_notifiers],
                             daemon=True
                             )
        t.name = notifier_task_name
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
                break
            if ended:
                print("Ending poll because session ended.")
                LOG.debug(f"Not waiting for session {session_id} for user {user_id} with start date {session_start_dt} "
                          f"already_started: {already_started}, ended: {ended}")
                break
            time.sleep(2)
