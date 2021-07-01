from fixtures import make_test_app
from datetime import datetime, timedelta, timezone
from api.database.mysql_session import engine


def test_initialize_aula_config():
    """
    Creates an aula config with only a "main" room
    and let's say an empty canvas object.
    """
    now = datetime.now(timezone.utc)
    five_hours = timedelta(hours=5)
    five_hours_from_now = now + five_hours
    five_hours_ago = now - five_hours

    upcoming_sessions = [
        {"session_id": 1, "session_datetime": five_hours_from_now},
        {"session_id": 1, "session_datetime": five_hours_ago}
    ]
    app = make_test_app(upcoming_sessions, engine)
    AulaConfig = app.models.AulaConfig
    ac = AulaConfig.query.order_by(AulaConfig.id.desc()).first()
    assert ac.config == {'rooms': {'main': {'students': {}}}}
    test_room_name = "testRoom1"
    resp = app.flask.post(
        "/aula/call",
        json=[{
            "method": "aula.create_room",
            "params": [ac.active_session_id, test_room_name],
        }]
    )
    assert test_room_name in resp.json["data"]["rooms"]

    resp2 = app.flask.post(
        "/aula/call",
        json=[{
            "method": "aula.get_rooms",
            "params": [ac.active_session_id],
        }]
    )
    assert [test_room_name, "main"].sort() == list(resp2.json["data"]).sort()

    resp3 = app.flask.post(
        "/aula/call",
        json=[{
            "method": "aula.delete_room",
            "params": [ac.active_session_id, test_room_name],
        }]
    )
    resp4 = app.flask.post(
        "/aula/call",
        json=[{
            "method": "aula.get_rooms",
            "params": [ac.active_session_id],
        }]
    )
    assert resp4.json["data"] == ["main"]
    test_student_name = "Michele"
    resp5 = app.flask.post(
        "/aula/call",
        json=[{
            "method": "aula.add_student_to_main",
            "params": [ac.active_session_id, test_student_name],
        }]
    )
    assert list(resp5.json["data"]["rooms"]["main"]["students"]) == [test_student_name]


    resp6 = app.flask.post(
        "/aula/call",
        json=[{
            "method": "aula.create_room",
            "params": [ac.active_session_id, test_room_name],
        }]
    )
    move_student_resp = app.flask.post(
        "/aula/call",
        json=[{
            "method": "aula.move_student",
            "params": [ac.active_session_id, test_student_name, "main", test_room_name],
        }]
    )
    assert list(move_student_resp.json["data"]["rooms"][test_room_name]["students"]) == [test_student_name]

