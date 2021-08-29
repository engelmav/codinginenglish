from aula.aula import create_aula_endpoints, AulaDataService, AulaActor
from database.models import model_factory
from main_api import create_main_api
from database.mysql_session import mysql_session
from database.providers import base_provider
from events import create_message_publisher, StudentSessionService, WebsocketManager
import redis
from simplekv.memory.redisstore import RedisStore

from config import config
from payment.payment_api import create_payment_api
from rest_schema import schema_factory
from services.auth import AuthService
from services.cie import UserService, ModuleService
from services.rocketchat import RocketChatService
from services.mailjet import send_mail


"""
Because of the way sqlalchemy configures itself,
we need to import its models AFTER we configure the database session.
"""
base_provider.configure_custom_base(mysql_session)
CustomBase = base_provider.get_base()
models = model_factory(CustomBase)  # API routes (blueprints) dependency
schema = schema_factory(mysql_session, models) # API routes (blueprints) dependency

redis_pw = config["cie.redis.password"]
redis_host = config["cie.redis.host"]
red = redis.StrictRedis(host=redis_host, password=redis_pw, port=6379)
redis_store = RedisStore(red)

module_service = ModuleService(models)
user_service = UserService(models)
student_session_service = StudentSessionService(red, models)

publish_message = create_message_publisher(red, "command")

websocket_manager = WebsocketManager(red)
rc_service = RocketChatService()

aula_actor = AulaActor(websocket_manager, rc_service, models)
aula_service = AulaDataService(models, schema, on_change=aula_actor.emit_event)
aula_endpoints = create_aula_endpoints(aula_service, websocket_manager)
auth_service = AuthService()
payment_api = create_payment_api(auth_service, module_service, user_service)
blueprints = [
    payment_api,
    aula_endpoints
]

app = create_main_api(
    publish_message,
    module_service,
    student_session_service,
    user_service,
    mysql_session,
    models,
    schema,
    aula_service,
    rc_service,
    blueprints,
    websocket_manager,
    send_mail
)

