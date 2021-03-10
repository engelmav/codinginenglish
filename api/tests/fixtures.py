from datetime import datetime, timezone, timedelta
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


class TestApp:
    def __init__(self, flask=None, alchemy_engine=None, alchemy_session=None, models=None, schema=None, CustomBase=None):
        """
        A global namespace for CIE test dependencies.
        :param flask:
        :param alchemy_engine:
        :param alchemy_session:
        :param models:
        :param schema:
        :param CustomBase:
        """
        self.flask = flask
        self.alchemy_engine = alchemy_engine
        self.alchemy_session = alchemy_session
        self.models = models
        self.schema = schema
        self.CustomBase = CustomBase


def make_models():
    engine = create_engine('sqlite:///:memory:', echo=True)
    sqlite_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
    base_provider.configure_custom_base(sqlite_session)
    CustomBase = base_provider.get_base()
    models = model_factory(CustomBase)
    init_db(CustomBase, engine)
    test_app = TestApp(
        alchemy_engine=engine,
        alchemy_session=sqlite_session,
        CustomBase=CustomBase,
        models=models
    )
    return test_app


def make_datetime_5_min_ago():
    now = datetime.now(timezone.utc)
    five_minutes = timedelta(minutes=5)
    five_minutes_ago = now - five_minutes
    return five_minutes_ago


def make_test_app(upcoming_sessions):
    redis = fakeredis.FakeStrictRedis()

    test_app = make_models()
    schema = schema_factory(test_app.alchemy_session, test_app.models)
    test_app.schema = schema
    models = test_app.models
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
        test_app.alchemy_session,
        models,
        schema,
        redis
    )
    main_api.testing = True
    test_app.flask = main_api.test_client()

    module_json = {
        "name": "Web App Development - Intermediate",
        "description": "some description."}
    resp = test_app.flask.post('/api/modules', json=module_json)
    created_module_id = resp.json.get('data').get('id')

    for sess in upcoming_sessions:
        start_dt = sess.get("session_datetime")
        created_session = models.ModuleSession(cie_module_id=created_module_id, session_datetime=start_dt)
        created_session.add()

        mod_session_id = created_session.id
        module_session_sqla = module_service.get_module_session_by_id(mod_session_id)
        user = models.User.query.filter_by(id=user_id).one()
        user_reg = user.add_to_module_session(module_session_sqla)

    return test_app
