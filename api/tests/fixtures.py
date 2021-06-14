from datetime import datetime, timezone, timedelta
import time

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

from api.main_api import create_main_api
from api.database.providers import base_provider
import fakeredis
from api.services.cie import UserService, ModuleService
from api.events import StudentSessionService, WebsocketManager
from aula.aula import create_aula_endpoints, AulaService
from database.handlers import init_db

from database.models import model_factory
from payment.payment_api import create_payment_api
from rest_schema import schema_factory
from services.rocketchat import RocketChatService
import logging

LOG = logging.getLogger(__name__)

test_user_payload = {
    "idTokenPayload": {
        "given_name": "FakeFirst",
        "family_name": "FakeLast",
        "email": "some.email@email.com"
    }
}
event_saved = None


class TestApp:
    def __init__(self, flask=None, alchemy_engine=None, alchemy_session=None, models=None, schema=None,
                 CustomBase=None):
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


def make_models(engine=None, initialize_db=False):
    if engine is None:
        LOG.info("No database engine specified. Using SQLite in-memory database")
        engine = create_engine("sqlite:///:memory:")
    alchemy_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
    base_provider.configure_custom_base(alchemy_session)
    CustomBase = base_provider.get_base()
    models = model_factory(CustomBase)
    if initialize_db:
        init_db(CustomBase, engine)
    return models, engine, alchemy_session, CustomBase


def make_datetime_5_min_ago():
    now = datetime.now(timezone.utc)
    five_minutes = timedelta(minutes=5)
    five_minutes_ago = now - five_minutes
    return five_minutes_ago


def make_test_app(upcoming_sessions, db_engine=None) -> TestApp:
    fake_redis = fakeredis.FakeStrictRedis()

    models, engine, alchemy_session, CustomBase = make_models(db_engine)
    test_app = TestApp(
        alchemy_engine=engine,
        alchemy_session=alchemy_session,
        CustomBase=CustomBase,
        models=models
    )
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

    def publish_message(message_str):
        print("Publishing message to queue", message_str)
        fake_redis_queue.append(message_str)

    student_session_service = StudentSessionService(fake_redis, models)
    student_session_service.set_user_id(100)
    rc_service = RocketChatService()

    class FakeAuthService:
        pass

    auth_service = FakeAuthService()
    payment_api = create_payment_api(auth_service, module_service, user_service)

    def broadcast_to_websocket(event):
        print(event)

    aula_service = AulaService(models, on_change=broadcast_to_websocket)
    websocket_manager = WebsocketManager(fake_redis)
    aula_endpoints = create_aula_endpoints(aula_service, websocket_manager)
    blueprints = [
        payment_api,
        aula_endpoints
    ]
    main_api = create_main_api(publish_message,
                               module_service,
                               student_session_service,
                               user_service,
                               test_app.alchemy_session,
                               models,
                               schema,
                               aula_service,
                               rc_service,
                               blueprints,
                               websocket_manager)
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
        _ = user.add_to_module_session(module_session_sqla)
        create_user_active_session(test_app, [user.id], mod_session_id)

    return test_app


def create_user_active_session(test_app, users, module_session_id):
    payload = {
        "students": users,
        "teachers": [],
        "prezzie_link": "https://slides.com/vincentengelmann/basic_session_02/live"
    }
    _ = test_app.flask.post(f"/api/module-sessions/{module_session_id}/active-sessions",
                            json=payload)
    print(f" **** User active session:")
