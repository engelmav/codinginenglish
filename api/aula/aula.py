from flask import blueprints, request, jsonify
import logging
from copy import deepcopy

aula_endpoints = blueprints.Blueprint("aula", url_prefix="/aula", import_name=__name__)
LOG = logging.getLogger(__name__)


def broadcast_to_aula(websocket_manager, event):
    """ Adapts AulaService's messages to the WebsocketManager's broadcast interface"""
    active_session_id = event.get("active_session_id")
    websocket_manager.broadcast(event, active_session_id)


# TODO: in initialize_user method (or in the configureAula method) we need to make a main
# room and put the students in it


class AulaService:
    def __init__(self, models, on_change=None):
        self.models = models
        self.on_change = on_change

    def initialize_aula_config(self, active_session_id):
        rooms = {
            "main": {
                "students": {}
            }
        }
        aula_config = {"rooms": rooms }
        ac = self.models.AulaConfig(
            active_session_id=active_session_id,
            config=aula_config
        )
        ac.add()
        return ac

    def get_aula_config(self, active_session_id):
        ac = self.models.AulaConfig.query.filter_by(
            active_session_id=active_session_id
        ).one()
        return ac

    def create_room(self, active_session_id, room):
        change_message = {
            "active_session_id": active_session_id,
            "action": "add_room",
            "data": room
        }
        self.on_change(change_message, )

        aula_config = self.get_aula_config(active_session_id)
        aula_config.config = deepcopy(aula_config.config)
        empty_students = {"students": {}}
        aula_config.config["rooms"].update({room: empty_students})
        aula_config.add()
        return aula_config.config

    def get_rooms(self, active_session_id):
        ac = self.get_aula_config(active_session_id)
        return list(ac.config["rooms"].keys())

    def delete_room(self, active_session_id, room):
        aula_config = self.get_aula_config(active_session_id)
        aula_config.config = deepcopy(aula_config.config)
        aula_config.config["rooms"].pop(room, None)
        aula_config.add()
        return aula_config.config

    def add_student_to_main(self, active_session_id, student_name):
        aula_config = self.get_aula_config(active_session_id)
        aula_config.config = deepcopy(aula_config.config)
        aula_config.config["rooms"]["main"]["students"].update({student_name: {}})
        aula_config.add()
        return aula_config.config

    def move_student(self, active_session_id, student, from_room, to_room):
        aula_config = self.get_aula_config(active_session_id)
        aula_config.config = deepcopy(aula_config.config)
        aula_config.config["rooms"][from_room]["students"].pop(student, None)
        student_entry = {student: {}}
        aula_config.config["rooms"][to_room]["students"].update(student_entry)

        change_message = {
            "active_session_id": active_session_id,
            "action": "move_student",
            "data": {
                "student": student,
                "from_room": from_room,
                "to_room": to_room
            }
        }
        self.on_change(change_message)
        aula_config.add()
        return aula_config.config


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


def create_aula_endpoints(aula_service, websocket_manager):
    rpc_executor = RPCExecutor()
    rpc_executor.add_commands(
        [
            {"aula.create_room": aula_service.create_room},
            {"aula.get_rooms": aula_service.get_rooms},
            {"aula.delete_room": aula_service.delete_room},
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
