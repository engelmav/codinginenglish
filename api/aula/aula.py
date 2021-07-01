from flask import blueprints, request, jsonify
import logging
from copy import deepcopy
from pymitter import EventEmitter


class AulaActor:
    def __init__(self, websocket_manager, rc_service, models):
        self.websocket_manager = websocket_manager
        self.rc_service = rc_service
        self.models = models
        self.event_emitter = EventEmitter()
        self.bind_events()

    def emit_event(self, event):
        self.event_emitter.emit(event.get("action"), event)

    def bind_events(self):
        self.event_emitter.on("aula.add_room", self.on_add_room)
        self.event_emitter.on("aula.move_student", self.on_move_student)
        self.event_emitter.on_any(func=self.broadcast_to_aula)

    def broadcast_to_aula(self, event):
        """ Adapts AulaService's messages to the WebsocketManager's broadcast interface"""
        active_session_id = event.get("active_session_id")
        aula_channel = f"aula-{active_session_id}"
        self.websocket_manager.broadcast(event, aula_channel)

    def on_add_room(self, event):
        room_name = event.get("data").get("room")
        slug = event.get("data").get("slug")
        channel_name = f"{room_name}-{slug}"
        res = self.rc_service.create_channel(channel_name)
        LOG.info(f"Result of adding room:", res)

    def on_move_student(self, event):
        data = event.get("data")
        to_channel = data.get("to_room")
        from_channel = data.get("from_room")
        student_id = data.get("student")
        slug = data.get("slug")
        from_room_name = f"{from_channel}-{slug}"
        to_room_name = f"{to_channel}-{slug}"
        user = self.models.User.query.filter_by(id=student_id).one()
        remove_res = self.rc_service.remove_user_from_channel(user.rocketchat_id, channel_name=from_room_name)
        add_res = self.rc_service.add_user_to_channel(user.rocketchat_id, channel_name=to_room_name)
        LOG.debug(f"User channel add result: {add_res}")


# TODO: in initialize_user method (or in the configureAula method) we need to make a main
# room and put the students in it


class AulaDataService:
    def __init__(self, models, schema, on_change=None):
        self.models = models
        self.schema = schema
        self.on_change = on_change

    def initialize_aula_config(self, active_session_id, student_ids):
        student_objects = {}
        for student_id in student_ids:
            # this is actually stale/copied data because
            # it's not retrieved until a student loads his or her aula.
            # so let's store the pure user ID and then enrich it onload.
            # where is it loaded from?
            student_objects[student_id] = {}

        rooms = {
            "main": {
                "students": student_objects
            }
        }
        aula_config = {"rooms": rooms}
        ac = self.models.AulaConfig(
            active_session_id=active_session_id,
            config=aula_config
        )
        ac.add()
        return ac

    def _get_aula_config(self, active_session_id):
        ac = self.models.AulaConfig.query.filter_by(
            active_session_id=int(active_session_id)
        ).one()
        # bleeding back into needing to normalize everything
        # but not really... users are the only non-ephemeral
        # thing in this structure so far.
        return ac

    def _enrich_userdata(self, rooms_config: dict) -> dict:
        user_schema = self.schema.UserSchema()
        rooms = rooms_config.keys()
        for room in rooms:
            students_in_room = rooms_config[room]["students"].keys()
            for student_id in students_in_room:
                student_user = self.models.User.query.filter_by(id=student_id).one()
                user_dict = user_schema.dump(student_user)
                rooms_config[room]["students"][student_id] = user_dict
        return rooms_config

    def get_aula_config(self, active_session_id) -> dict:
        config_model = self._get_aula_config(active_session_id)
        aula_config = config_model.config
        rooms_with_userdata = self._enrich_userdata(aula_config["rooms"])
        aula_config["rooms"] = rooms_with_userdata
        return aula_config

    def create_room(self, active_session_id, room, slug):
        change_message = {
            "active_session_id": active_session_id,
            "action": "aula.add_room",
            "data": {"room": room, "slug": slug}
        }
        self.on_change(change_message)

        aula_config = self._get_aula_config(active_session_id)
        duped_config = deepcopy(aula_config.config)
        empty_students = {"students": {}}
        duped_config["rooms"].update({room: empty_students})
        aula_config.config = duped_config
        aula_config.add()
        config = aula_config.config
        rooms_with_userdata = self._enrich_userdata(config["rooms"])
        config["rooms"] = rooms_with_userdata
        return config

    def get_rooms(self, active_session_id):
        ac = self._get_aula_config(active_session_id)
        return list(ac.config["rooms"].keys())

    def delete_rooms(self, active_session_id, rooms):
        aula_config = self._get_aula_config(active_session_id)
        aula_config.config = deepcopy(aula_config.config)
        for room in rooms:
            aula_config.config["rooms"].pop(room, None)
        aula_config.add()
        config = aula_config.config
        rooms_with_userdata = self._enrich_userdata(config["rooms"])
        config["rooms"] = rooms_with_userdata
        return config

    def add_student_to_main(self, active_session_id, student_name):
        aula_config = self._get_aula_config(active_session_id)
        aula_config.config = deepcopy(aula_config.config)
        aula_config.config["rooms"]["main"]["students"].update({student_name: {}})
        aula_config.add()
        config = aula_config.config
        rooms_with_userdata = self._enrich_userdata(config["rooms"])
        config["rooms"] = rooms_with_userdata
        return config

    def move_student(self, active_session_id, student, from_room, to_room, slug):
        aula_config = self._get_aula_config(active_session_id)
        duped_config = deepcopy(aula_config.config)
        duped_config["rooms"][from_room]["students"].pop(str(student), None)
        student_entry = {student: {}}
        duped_config["rooms"][to_room]["students"].update(student_entry)
        aula_config.config = duped_config
        aula_config.add()

        change_message = {
            "active_session_id": active_session_id,
            "action": "aula.move_student",
            "data": {
                "student": student,
                "from_room": from_room,
                "to_room": to_room,
                "slug": slug
            }
        }

        self.on_change(change_message)

        config = aula_config.config
        rooms_with_userdata = self._enrich_userdata(config["rooms"])
        config["rooms"] = rooms_with_userdata
        return config


class RPCExecutor:
    def __init__(self):
        self.methods = {}
        self.results_state = {}

    def add_commands(self, commands):
        for cmd in commands:
            self.methods = {**self.methods, **cmd}

    def _call(self, method_name, params=None, result_params=None, is_terminal=False):
        _method = self.methods[method_name]
        if params is None and result_params is None:
            result = _method()
        if params and result_params:
            saved_result_name = result_params.get("name")
            result = _method(*params)
            self.results_state[saved_result_name] = result
        if params and not result_params:
            result = _method(*params)
        if not params and result_params:
            saved_result_name = result_params.get("name")
            result = _method()
            self.results_state[saved_result_name] = result
        if is_terminal:
            return result

    def execute(self, procedure):
        last_line = len(procedure)
        for idx, line in enumerate(procedure):
            method_name = line.get("method")
            params = line.get("params", None)
            save_result = line.get("saved_result", None)
            is_last_line = last_line == idx + 1
            result = self._call(method_name, params=params, result_params=save_result,
                                is_terminal=is_last_line)
            if is_last_line:
                return result


aula_endpoints = blueprints.Blueprint("aula", url_prefix="/aula", import_name=__name__)
LOG = logging.getLogger(__name__)


def create_aula_endpoints(aula_service, websocket_manager):
    rpc_executor = RPCExecutor()
    rpc_executor.add_commands(
        [
            {"aula.create_room": aula_service.create_room},
            {"aula.get_rooms": aula_service.get_rooms},
            {"aula.delete_rooms": aula_service.delete_rooms},
            {"aula.add_student_to_main": aula_service.add_student_to_main},
            {"aula.move_student": aula_service.move_student},
            {"aula.get_aula_config": aula_service.get_aula_config}
        ]
    )

    @aula_endpoints.route("/students")
    def get_connected_students():
        active_session_id = request.args.get("activeSessionId")
        clients = websocket_manager.get_clients_on_channel(active_session_id)
        LOG.debug(f"/students returning students for active_session_id {active_session_id}: {clients}")
        clients = [
            {"id": 1, "name": "Carlo", "connectedAt": ""},
            {"id": 2, "name": "Xavier"},
            {"id": 3, "name": "Karen"},
            {"id": 4, "name": "Alberto"},
        ]
        return jsonify(dict(
            status="success",
            data=clients,
            messages=["success"]
        ))

    @aula_endpoints.route("/call", methods=["POST"])
    def bind_flask_to_rpc():
        procedure = request.get_json()
        LOG.debug(f"/call hit with payload {procedure}")
        result = rpc_executor.execute(procedure)
        return jsonify(status="success", messages=["done"], data=result)
        # jsonify(data=rpc_executor.execute(procedure))
    return aula_endpoints
