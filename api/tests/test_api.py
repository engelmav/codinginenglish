from datetime import datetime, timedelta, timezone
import pytest
from tests.fixtures import make_test_app, make_datetime_5_min_ago


def test_get_future_sessions():
    now = datetime.now(timezone.utc)
    five_hours = timedelta(hours=5)
    five_hours_from_now = now + five_hours
    five_hours_ago = now - five_hours

    upcoming_sessions = [
        {"session_id": 1, "session_datetime": five_hours_from_now},
        {"session_id": 1, "session_datetime": five_hours_ago}
    ]
    test_app = make_test_app(upcoming_sessions)
    test_user_id = "1"
    resp = test_app.flask.get(f"/api/users/{test_user_id}/module-sessions",
                        query_string={"futureOnly": "true"})
    expected_date_str = five_hours_from_now.strftime('%a, %-d %b %Y %H:%M:%S %Z')
    recvd_start_dt = resp.json.get('data')[0].get('start_date')
    recvd_start_dt_utc = recvd_start_dt.replace('GMT', 'UTC')  # oh yes, that happened.
    assert recvd_start_dt_utc == expected_date_str
    assert len(resp.json.get('data')) == 1


def test_create_active_session():
    five_mins_ago = make_datetime_5_min_ago()
    upcoming_sessions = [
        {"session_id": 1, "session_datetime": five_mins_ago},
    ]
    test_app = make_test_app(upcoming_sessions)
    module_session_id_from_fixture = 1
    student_id_from_fixture = 1
    teacher_user = test_app.models.User(firstname="teacher1", lastname="teacherlastname", email="teacher1@cie.com")
    teacher_user.add()
    students_ids = [student_id_from_fixture]
    teacher_ids = [teacher_user.id]
    url = f"/api/module_sessions/{module_session_id_from_fixture}/active_sessions"
    resp = test_app.flask.post(
        url,
        json={"students": students_ids, "teachers": teacher_ids}
        # "/api/site-map"
    )
    assert resp.json["status"] == "success"
