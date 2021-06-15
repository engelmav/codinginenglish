import datetime
import json
import threading
from typing import List

import gevent
from flask import Flask, jsonify, request
from flask_sockets import Sockets
from sqlalchemy import func

from aula.aula import AulaService
from database.models import Models
from events import StudentSessionService, WebsocketManager
from config import config
import services.cie as cie

from operator import itemgetter
import logging

from rest_schema import Schema
from services.rocketchat import RocketChatService

LOG = logging.getLogger(__name__)
app = Flask(__name__)
sockets = Sockets(app)


def make_response(payload_dict, status_code):
    resp = jsonify(payload_dict)
    resp.status_code = status_code
    return resp


def create_main_api(publish_message,
                    module_service: cie.ModuleService,
                    student_session_service: StudentSessionService,
                    user_service: cie.UserService,
                    db_session,
                    models: Models,
                    schema: Schema,
                    aula_service: AulaService,
                    rc_service: RocketChatService,
                    blueprints,
                    websocket_manager: WebsocketManager):

    for blueprint in blueprints:
        app.register_blueprint(blueprint)

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    # MESSAGING TO FRONTEND
    @app.route('/api/command', methods=['POST'])
    def send_sse():
        command = request.get_json()
        channels = command.get("command").get("channels")
        # # we are doing this twice to clean up control characters
        message = json.dumps(command)

        """
        while not ws.closed:
            gevent.sleep(0.5)
            message = ws.receive()

            if message:
                LOG.debug(f"Inserting message {message}")
                publish_message(message)
        """
        results = []
        messages = []
        status = "success"
        resp_code = 200
        for channel in channels:
            try:
                res = websocket_manager.broadcast(message, channel)
                results.append[res]
            except KeyError:
                messages.append(f"Channel {channel} is not currently registered in the WebsocketManager")
                status = "error"
                resp_code = 500
        return make_response(dict(status=status, messages=messages, data=results), resp_code)

    @sockets.route("/ws/stream")
    def initialize_websocket_connection(ws):
        # the below line is executed when this endpoint is hit, and this endpoint is hit
        # only when opening a new websocket connection.
        websocket_manager.initialize_socket(ws)

    def _get(key, default=None):
        j = request.get_json()
        return j.get(key, default)

    def serialize(data, clazz, many=False):
        """
        JSON-serialize a SQLAlchemy instance using a corresponding Marshmallow schema.
        :param data: an instance of a SQLAlchemy model
        :param clazz: the schema class corresponding to the SQLAlchemy model
        :param many: bool. many or single.
        :return: json string
        """
        _schema = clazz(many=many)
        return jsonify(status="success", data=_schema.dump(data),
                       messages="Object(s) created successfully.")

    def deserialize(data, clazz):
        _schema = clazz()
        loaded = _schema.load(data)
        return loaded.data

    @app.route('/api/modules', methods=['GET'])
    def get_cie_modules():
        modules = models.CieModule.query.all()
        return serialize(modules, schema.CieModuleSchema, many=True)

    @app.route('/api/modules', methods=['POST'])
    def create_modules():
        """
        [
            {
                "name": "Dev Teams and Loops",
                "description": "Development teams, roles, salaries"
            }
        ]
        :return:
        {
            "description": "value",
            "id": 6,
            "name": "value"
        }
        """
        inst = schema.CieModuleSchema().make_instance(request.get_json())
        inst.add()
        return serialize(inst, schema.CieModuleSchema)

    @app.route('/api/cie-modules/<cie_module_id>/sessions', methods=['POST'])
    def add_session_to_module(cie_module_id):
        """
        {
            "session_datetime": "2020-05-20 18:00:00"
        }
        :param cie_module_id: str. integer id of module.
        :return: ModuleSessionSchema object.
        """
        start_dt_str = _get('session_datetime')
        LOG.debug(f"Adding session of date {start_dt_str} to cie_module_id {cie_module_id}")
        start_dt_obj = datetime.datetime.fromisoformat(start_dt_str)
        _session = models.ModuleSession(cie_module_id=cie_module_id, session_datetime=start_dt_obj)
        _session.add()
        LOG.debug(f"Session added: {_session}")
        return serialize(_session, schema.ModuleSessionSchema)

    @app.route('/api/module_sessions/<session_id>', methods=['DELETE'])
    def delete_session_from_module(session_id):
        _session = models.ModuleSession.query(id=session_id).one()
        _session.delete()
        return jsonify(
            status="success",
            messages=["Deleted session"]
        )

    @app.route("/api/module-sessions/<session_id>/active-sessions", methods=["POST"])
    def activate_module_session(session_id):
        # TODO: We need "add single user to existing active session"
        """
        Teacher or admin POSTs here to perform the following tasks:
        1. assign teachers to a given session
        2. assign students to a given session
        3. provide a unique instance of a running module session
        4. derive unique video and chat identifiers
        5. Create the Rocketchat channel for the session. (will happen in subsequent call)
        This sets up a classroom for students and teachers to come into.
        """
        data = {}
        messages = []
        req = request.get_json()
        try:
            teacher_ids, student_ids, prezzie_link = itemgetter("teachers", "students", "prezzie_link")(req)
        except Exception as e:
            LOG.exception(f"Missing parameter: {e}", exc_info=True)
            messages.append("Missing or invalid parameter. Endpoint "
                            "requires `teachers`, `students`, `prezzie_link`")
            return make_response(dict(status="error", messages=messages), 500)
        """
        We want to be able to create multiple ActiveSessions
        for a given ModuleSession...so that we can have identical
        simultaneous active sessions.
        The uniqueness is based on the *users*. We want to check for the uniqueness
        of (module_session_id, user_id): if you add a user and his or her module_session
        to another active_session or user_active_session, you'll be putting them into
        two classes at the same time.
        """
        query = models.ActiveSession.query
        max_query = query.with_entities(func.max(models.ActiveSession.id))
        latest_pk = max_query.scalar()
        first_active_session = latest_pk is None
        if first_active_session:
            latest_pk = 0
        active_sesssion_slug = f"{session_id}-{int(latest_pk) + 1}"
        chat_channel = f"cie-chat-{active_sesssion_slug}"
        try:
            _as = models.ActiveSession(
                is_active=True,
                module_session_id=session_id,
                video_channel=f"codinginenglish-video-{active_sesssion_slug}",
                prezzie_link=prezzie_link,
                chat_channel=chat_channel
            )
            _as.add()
            as_schema = schema.ActiveSessionSchema()
            active_session_json = as_schema.dump(_as)
            data["active_session"] = active_session_json
            messages.append(f"Created ActiveSession with id {_as.id}")
        except Exception:
            LOG.error("Failed to create ActiveSession in database.", exc_info=True)
            messages.append("An error occurred adding the ActiveSession: please check logs.")
            make_response(dict(status="error", messages=messages))

        initial_aula_config = aula_service.initialize_aula_config(_as.id, student_ids)
        acs = schema.AulaConfigSchema()
        data["aula_config"] = acs.dump(initial_aula_config)
        created_uas = []
        uas_schema = schema.UserActiveSessionSchema()
        for user_id in teacher_ids + student_ids:
            uas = models.UserActiveSession(
                user_id=user_id,
                active_session_id=_as.id,
            )
            uas.add()
            created_uas.append(uas_schema.dump(uas))
        data["user_active_sessions"] = created_uas
        response = make_response(
            dict(status="success", messages=messages, data=data), 200)
        return response

    @app.route("/api/users/<user_id>/active-sessions", methods=["GET"])
    def get_active_session_by_user_id(user_id):
        uas = (models.UserActiveSession.query
               .join(models.ActiveSession, models.ActiveSession.is_active == True)
               .filter(models.UserActiveSession.user_id == user_id)
               .one())

        _schema = schema.ActiveSessionSchema()
        serialized = _schema.dump(uas.active_session)
        LOG.debug(f"Returning active session: {serialized}")
        return jsonify(
            status="success",
            data=serialized,
            messages=["Retrieved active session."]
        )

    @app.route("/api/rocketchat/channel.create", methods=["POST"])
    def create_rocketchat_channel():
        messages = []
        try:
            channel_name = request.get_json().get("channelName")
        except Exception as e:
            messages.append(f"Endpoint expecting param `channelName`")
            return make_response(dict(status="error", messages=messages), 500)
        try:
            channel_resp = rc_service.create_channel(channel_name)
            messages.append(f"Successfully created Rocketchat channel {channel_name}")
            LOG.debug(f"Created Rocketchat channel {channel_resp}")
        except Exception:
            messages.append(f"Failed to create Rocketchat channel {channel_name}")
            LOG.error(f"Failed to create rocketchat channel {channel_name}", exc_info=True)
            return make_response(dict(status="error", messages=messages), 500)
        return make_response(dict(status="success", messages=messages), 200)

    @app.route('/api/cie-modules')
    def get_modules():
        # res = models.ModuleSession.query.all()
        # _schema = schema.ModuleSessionSchema()
        _schema = schema.CieModuleSchema()
        modules = models.CieModule.query.all()
        serialized = _schema.dump(modules, many=True)
        return make_response(
            dict(messages=["Successfully retried module sessions."],
                 data=serialized), 200)

    def make_rocketchat_username(firstname, lastname):
        return firstname[0] + lastname

    @app.route("/api/users/<user_id>", methods=["PATCH"])
    def patch_user(user_id):
        patch_dict = request.get_json()
        user = models.User.query.filter_by(id=user_id).one()
        for key, value in patch_dict.items():
            setattr(user, key, value)
        user.session.flush()
        user.session.commit()
        updated_user = models.User.query.filter_by(id=user_id).one()
        _schema = schema.UserSchema()
        data = _schema.dump(updated_user)
        return make_response(dict(data=data, messages=["Successfully updated user"]), 200)

    @app.route('/api/users', methods=['POST'])
    def initialize_user():
        """
        Initializes a user. This involves user creation if necessary, or returning
        a known existing user based on "given name" and "family name", both Auth0
        User object fields. Will also return whether the user currently has a class that
        is in session.
        :return: UserSchema
        {
          "accessToken": "<access token>",
          "idToken": "<id token>",
          "idTokenPayload": {
            "given_name": "Vincent",
            "family_name": "Engelmann",
            "nickname": "vincent.engelmann1",
            "name": "Vincent Engelmann",
            ...
          },
          ...
          "expiresIn": 7200,
          "tokenType": "Bearer",
          "scope": "openid profile email"
        }
        Captures users logged on via Auth0 for use in registration and view permissions.
        This will NOT register a user for a module, only create a user record.
        :return:
        """
        req = request.get_json()
        id_token_payload = req['idTokenPayload']
        given_name = id_token_payload.get("given_name")
        family_name = id_token_payload.get("family_name")
        email = id_token_payload.get("email")

        auth0_access_token = req["accessToken"]
        _user = user_service.create_user(email, first_name=given_name, last_name=family_name)

        messages = []
        try:
            auth0_login_resp = rc_service.login_with_auth0(auth0_access_token, config.get("cie.auth0.secretkey"))
            rocketchat_auth_token = auth0_login_resp.get("data").get("authToken")
            messages.append("Retrieved RocketChat auth token.")
        except Exception as e:
            messages.append(f"Error creating or logging in user {email} to Rocketchat")
            LOG.error(f"Error creating or logging in user {e}", exc_info=True)
            return make_response(dict(messages=messages, status="error"), 500)

        messages.append("Stored Rocketchat auth token in session successfully.")

        user_id = _user.id
        student_session_service.set_user_id(user_id)

        upcoming_sessions: List[dict] = student_session_service.get_upcoming_sessions()
        has_session_in_progress = False

        for sess in upcoming_sessions:
            if sess.get('in_progress'):
                has_session_in_progress = True
                LOG.debug(f"User has session in progress")
                next  # Do not launch poller thread for session already started
            session_start_dt = sess.get('session_datetime')
            session_id = sess.get('session_id')
            student_session_service.add_on_session_start(publish_message)
            LOG.debug(f"Registering student_session_service for session_id {session_id}")
            student_session_service.notify_on_session_start(session_id, session_start_dt)
        messages.append("Initialized user successfully.")
        user_schema = schema.UserSchema()
        user_payload = user_schema.dump(_user)
        # TODO https://github.com/engelmav/codinginenglish/issues/110
        if email.startswith("vincent.engelmann1@"):
            user_payload["role"] = "instructor"
        payload = dict(user=user_payload, has_session_in_progress=has_session_in_progress,
                       rocketchat_auth_token=rocketchat_auth_token)
        resp = make_response(dict(status="success", data=payload, messages=messages), 200)
        return resp

    @app.route('/api/monitor', methods=['GET'])
    def get_threads():
        threads = []
        for thread in threading.enumerate():
            threads.append(thread.name)
        monitor = {"channels": list(websocket_manager.channels.keys()), "threads": threads}
        return jsonify(monitor)

    @app.route('/api/users/<int:user_id>/module-sessions', methods=['GET'])
    def get_user_sessions(user_id):
        """
        Get the sessions for which a user is registered.
        :return:
        """

        future_only = request.args.get('futureOnly')
        registered_modules = \
            user_service.registered_modules(user_id, future_only=future_only)
        # todo: if we do this again, use marshmallow
        serializable = [obj.__dict__ for obj in registered_modules]

        return jsonify(
            dict(
                data=serializable,
                status="success",
                messages=["Successfully retrieved registered modules."]
            )
        )

    @app.route('/api/users/<int:user_id>/module-sessions', methods=['POST'])
    def register_user_to_session(user_id):
        """
        Register a user to a session with a pre-created user ID.
        """
        LOG.debug(f"register_user_to_session(): Looking up user_id {user_id}")
        user = models.User.query.filter_by(id=user_id).one()
        module_session_json = request.get_json()
        LOG.debug(f"register_user_to_session(): Looking up module_session_id {module_session_json.get('module_session_id')}")
        module_session = module_service.get_module_session_by_id(module_session_json.get('module_session_id'))

        user_reg = user.add_to_module_session(module_session)

        LOG.debug(f"Registering student id {user.id} to module_session id {module_session}")

        session_id = user_reg.module_session_id
        session_start_dt = user_reg.module_session.session_datetime

        def handle_session_start(session_start_message):
            """
            If session already marked as in progress, do not emit message.
            The web client will rely on Redis state.
            :param session_start_message:
            :return:
            """
            student_session_service.set_user_id(user_id)
            # student_session_manager is already configured at initialize_user()
            if student_session_service.is_session_in_progress():
                LOG.debug("Student session already seen as in progress; handle_session_start ending")
                return
            student_session_service.set_session_in_progress()
            LOG.debug("Publishing session_start message in handle_session_start")
            publish_message(session_start_message)

        # TODO: make this a singleton
        student_session_service.add_on_session_start(handle_session_start)
        student_session_service.notify_on_session_start(session_id, session_start_dt)

        return serialize(user_reg, schema.UserModuleRegistrationSchema)

    @app.route("/api/site-map")
    def site_map():
        links = []
        for rule in app.url_map.iter_rules():
            # Filter out rules we can't navigate to in a browser
            # and rules that require parameters
            # if has_no_empty_params(rule):
            links.append({"methods": list(rule.methods), "url": rule.rule})
        return jsonify(links)

    return app
