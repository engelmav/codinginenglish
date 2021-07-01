import json
import logging
import threading
from datetime import datetime, timedelta, timezone

import gevent
import time

from geventwebsocket.websocket import WebSocket

LOG = logging.getLogger(__name__)


class Event:
    def __init__(self, event_type, message):
        self.event_type = event_type
        self.message = message

    def __str__(self):
        return (
            f"event: {self.event_type}\ndata: {self.message}\n\n"
        )


def create_message_publisher(redis_client, channel_name):
    def publish_message(message_str):
        res = redis_client.publish(channel_name, message_str)
        return res

    return publish_message


def create_message_listener(redis_client, channel_name):
    pubsub = redis_client.pubsub()
    pubsub.subscribe(channel_name)
    return pubsub


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


class WSClient:
    """Simple wrapper to associate a client_id to the websocket to prevent recursive websockets."""
    def __init__(self, websocket: WebSocket, client_id):
        self.websocket = websocket
        self.client_id = client_id


class WebsocketManager:
    """
    Interface that initializes WSClients and sets up their channels with the MessagingBackend.
    Acts as a proxy for sending messages through MessagingBackend and out to connected WSClients.
    """
    def __init__(self, redis):
        self.redis = redis
        self.channels = {}
        self.clients = []

    def initialize_socket(self, websocket):
        """
        Expects an initial message with the following payload:
        {
            command: "subscribe",
            identifier: { channel: "main" },
            <clientId: clientId>
        }
        (clientId is optional)
        """
        open_message = websocket.receive()
        open_msg_dict = json.loads(open_message)
        if open_msg_dict.get("command") is None or open_msg_dict.get("command") != "subscribe":
            raise Exception("We received an initial message that does not contain a subscribe request.")
        channel = open_msg_dict.get("identifier").get("channel")
        client_id = open_msg_dict.get("clientId", "anon")
        self.join_or_create(websocket, channel, client_id)

    def join_or_create(self, ws_client, channel_name, client_id=None):
        # A WebsocketManager has many channels
        #   * a channel has a backend (pubsub)
        #   * a channel has many clients

        # In this way, each websocket channel has a redis pubsub channel behind it.
        # And each pubsub/websocket channel has many clients.

        # two message types:
        #    1) an "open"
        #    2) a "message"
        # By virtue of being the "first message" you will be an "open" (given the websocket.onopen in frontend)
        # After opening, you can "start listening" for the second type, "message"
        # create a redis publisher on the channel name
        client = WSClient(ws_client, client_id)
        if channel_name not in self.channels:
            LOG.debug(f"Creating new websocket channel `{channel_name}`, initiated by client {client}, client id "
                      f"{client_id}.")
            message_publisher = create_message_publisher(self.redis, channel_name)
            message_listener = create_message_listener(self.redis, channel_name)
            messaging_backend = MessagingBackend(channel_name, message_listener, message_publisher)
            messaging_backend.start()
            self.channels[channel_name] = messaging_backend
        # Channel and its backend already exist; add client to existing backend.
        LOG.debug(f"Adding new client `{client}` to existing channel `{channel_name}`.")
        self.channels[channel_name].register_and_listen(client)

    def broadcast(self, message, channel):
        event_str = json.dumps(message)
        result = self.channels[channel].publish_to_redis(event_str)
        return result

    def get_clients_on_channel(self, channel):
        return self.channels[channel].clients


class MessagingBackend:
    """
    Interface that binds websocket channel to a redis pubsub channel.
    The functionality of this class is accessed through the "proxy" of
    WebsocketManager.
    """
    def __init__(self, channel, listener, publish):
        self.channel = channel
        self.clients = []
        self.listener = listener
        self.publish = publish

    def publish_to_redis(self, message):
        # LOG.debug(f"Publishing message on channel {self.channel}: {message}")
        self.publish(message)

    def __iter_data(self):
        for message in self.listener.listen():
            data = message.get('data')
            if message['type'] == 'message':
                yield data

    def register_and_listen(self, client: WSClient):
        """Register a WebSocket connection for Redis updates."""
        self.clients.append(client)
        self._listen_on_socket(client)

    def _listen_on_socket(self, client: WSClient):
        # spin up thread for this ws_client
        # this ensures the incoming websocket messages are published to the correct redis pubsub channel.
        LOG.debug(f"Client `{client}` now listening for websocket messages on channel {self.channel}.")
        while not client.websocket.closed:
            self._heartbeat(client.websocket)
            message = client.websocket.receive()
            if message is None:
                # LOG.debug(f"websocket channel {self.channel} received message None message. Skipping.")
                break
            # LOG.debug(f"websocket channel {self.channel} received message {message}. Publishing to redis.")
            self.publish_to_redis(message)
            gevent.sleep(0.1)

    def _heartbeat(self, socket: WebSocket):
        socket.handler.websocket.send_frame("HB", socket.OPCODE_PING)

    def _send_to_socket(self, client, data):
        """Send given data to the registered client.
        Automatically discards invalid connections."""
        try:
            LOG.debug(f"channel {self.channel}:  ta {data} to client {client}")
            client.websocket.send(data)
        except Exception:
            LOG.warning(f"client send failed with exception. Removing client {client}", exc_info=True)
            self.clients.remove(client)

    def run(self):
        """Listens for new messages in Redis, and sends them to clients."""
        for data in self.__iter_data():
            loaded_message = json.loads(data)
            client_id = loaded_message.get("cid")
            broadcast_to = []
            for client in self.clients:
                if client.client_id != client_id:
                    broadcast_to.append(client)

            for client in broadcast_to:
                recursive = (client_id == client.client_id and client_id is not None)
                LOG.debug(f"client.client_id = {client.client_id} recursive = {recursive}")
                if not recursive:
                    gevent.spawn(self._send_to_socket, client, data)

    def start(self):
        """Maintains Redis subscription in the background."""
        LOG.debug(f"Spawning gevent thread for Websocket channel {self.channel}.")
        gevent.spawn(self.run)
