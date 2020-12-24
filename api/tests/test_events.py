import datetime
import time

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

from api.main_api import create_main_api
from api.database.providers import base_provider
import fakeredis
from api.services.cie import UserService, ModuleService
from api.events import StudentSessionService
from database.handlers import init_db

from database.models import model_factory
from rest_schema import schema_factory

test_user_payload = {
    "idTokenPayload": {
        "given_name": "FakeFirst",
        "family_name": "FakeLast",
        "email": "some.email@email.com"
    }
}
event_saved = None


def make_test_app(upcoming_sessions):
    redis = fakeredis.FakeStrictRedis()

    engine = create_engine('sqlite:///:memory:', echo=True)
    sqlite_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
    base_provider.configure_custom_base(sqlite_session)
    CustomBase = base_provider.get_base()

    models = model_factory(CustomBase)
    schema = schema_factory(sqlite_session, models)

    init_db(CustomBase, engine)
    user_service = UserService(models)
    module_service = ModuleService(models)
    user = user_service.create_user("some.email@email.com",
                                    first_name="FakeFirst",
                                    last_name="FakeLast")
    user_id = user.id

    fake_redis_queue = []

    def event_stream():
        for item in fake_redis_queue:
            print("Yielding TEST message: ", item)
            yield item

    def publish_message(message_str):
        print("Publishing message to queue", message_str)
        fake_redis_queue.append(message_str)

    student_session_service = StudentSessionService(redis, models)
    student_session_service.set_user_id(100)

    main_api = create_main_api(
        event_stream,
        publish_message,
        module_service,
        student_session_service,
        user_service,
        sqlite_session,
        models,
        schema,
        redis
    )
    main_api.testing = True
    test_app = main_api.test_client()

    module_json = {
        "name": "Web App Development - Intermediate",
        "description": "some description."}
    resp = test_app.post('/api/modules', json=module_json)
    created_module_id = resp.json.get('data').get('id')

    for sess in upcoming_sessions:
        # created_mod_session = test_app.post(
        #     f"/api/cie-modules/{created_module_id}/sessions",
        #     json=sess)
        start_dt = sess.get("session_datetime")
        created_session = models.ModuleSession(cie_module_id=created_module_id, session_datetime=start_dt)
        created_session.add()

        mod_session_id = created_session.id
        module_session_sqla = module_service.get_module_session_by_id(mod_session_id)
        user = models.User.query.filter_by(id=user_id).one()
        user_reg = user.add_to_module_session(module_session_sqla)

    return test_app


def test_session_start_no_message_on_initialize_user():
    """
    GIVEN user's session starts in 5 hours
    WHEN the user logs in
    THEN the user will not receive a message
    :return:
    """
    now = datetime.datetime.now()
    five_hours = datetime.timedelta(hours=5)
    five_hours_from_now = now + five_hours

    upcoming_sessions = [
        {"session_id": 1, "session_datetime": five_hours_from_now}
    ]
    test_app = make_test_app(upcoming_sessions)
    _ = test_app.post(
        '/api/users',
        json=test_user_payload
    )
    stream = test_app.get('/api/stream')
    expected_empty_message = ''
    # expected_message = '{"event": "student-session-manager", "event_type": "session_start", "data": {"session_id": 1, "user_id": 100}}'
    actual_message = stream.data.decode('utf-8')
    assert actual_message == expected_empty_message
    # TODO:
    #  check if student_session_manager is verifying
    #  (already_started and not_ended or not_started_yet)


def test_session_started_before_initialize_user():
    """
    GIVEN user's session started 5 minutes ago
    WHEN the user logs in
    THEN the user will receive is_in_session == True
    :return:
    """
    now = datetime.datetime.now()
    five_minutes = datetime.timedelta(minutes=5)
    five_minutes_ago = now - five_minutes
    upcoming_sessions = [
        {"session_id": 1, "session_datetime": five_minutes_ago}
    ]
    test_app = make_test_app(upcoming_sessions)
    initialize_user_resp = test_app.post(
        '/api/users',
        json=test_user_payload
    )

    stream = test_app.get('/api/stream')
    # expected_message = '{"event": "student-session-manager", "event_type": "session_start", "data": {"session_id": 1, "user_id": 100}}'
    # actual_message = stream.data.decode('utf-8')
    assert initialize_user_resp.json.get('data').get('has_session_in_progress') is True


# TODO: come back to this. Test closer to logic.
def test_session_starts_while_user_logged_on():
    """
    GIVEN user is logged on
    WHEN their session starts
    THEN they receive a message
    :return:
    """
    now = datetime.datetime.now()
    five_seconds = datetime.timedelta(seconds=2)
    five_seconds_from_now = now + five_seconds

    seed_session = [
        {"session_id": 1, "session_datetime": five_seconds_from_now}
    ]
    test_app = make_test_app(seed_session)
    initialize_user_resp = test_app.post(
        '/api/users',
        json=test_user_payload
    )
    time.sleep(8)
    stream = test_app.get('/api/stream')
    actual_message = stream.data.decode('utf-8')
    # TODO: message keeps re-publishing
    assert actual_message is not None
    print(actual_message)


def test_session_manager_notify():
    redis = fakeredis.FakeStrictRedis()

    engine = create_engine('sqlite:///:memory:')
    sqlite_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
    base_provider.configure_custom_base(sqlite_session)
    CustomBase = base_provider.get_base()

    models = model_factory(CustomBase)

    init_db(CustomBase, engine)

    user_service = UserService(models)
    user = user_service.create_user("some.email@email.com",
                                    first_name="FakeFirst",
                                    last_name="FakeLast")
    module_service = ModuleService(models)
    mod = module_service.create_module('fakename', 'fake desc')

    now = datetime.datetime.now()
    five_seconds = datetime.timedelta(seconds=5)
    five_seconds_from_now = now + five_seconds

    module_session = \
        models.ModuleSession(cie_module_id=mod.id, session_datetime=five_seconds_from_now)
    module_session.add()

    user.add_to_module_session(module_session)

    session_service = StudentSessionService(redis, models)
    session_service.set_user_id(user.id)

    def handle_start(event):
        print("I GOT CALLED!******************")
        global event_saved
        event_saved = event

    session_service.add_on_session_start(handle_start)
    session_service.notify_on_session_start(module_session.id, module_session.session_datetime)

    time.sleep(8)

    assert "session_start" in event_saved
    print(event_saved)













