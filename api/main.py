from database.models import model_factory
from main_api import create_main_api
from database.mysql_session import mysql_session
from database.providers import base_provider
from events import create_event_stream, create_publish_message, StudentSessionService
import redis
from simplekv.memory.redisstore import RedisStore

from config import config
from rest_schema import schema_factory
from services.cie import UserService, ModuleService

"""
Because of the way sqlalchemy configures itself,
we need to import its models AFTER we configure the database session.
"""
base_provider.configure_custom_base(mysql_session)
CustomBase = base_provider.get_base()
models = model_factory(CustomBase)  # API routes (blueprints) dependency
schema = schema_factory(mysql_session, models)     # API routes (blueprints) dependency

redis_pw = config["cie.redis.password"]
redis_host = config["cie.redis.host"]
red = redis.StrictRedis(host=redis_host, password=redis_pw, port=6379)
redis_store = RedisStore(red)

module_service = ModuleService(models)
user_service = UserService(models)
student_session_service = StudentSessionService(red, models)

pubsub = red.pubsub()
pubsub.subscribe('cie')
pub_sub_listener = pubsub.listen()
event_stream = create_event_stream(red)
publish_message = create_publish_message(red)

app = create_main_api(
    event_stream,
    publish_message,
    module_service,
    student_session_service,
    user_service,
    mysql_session,
    models,
    schema,
    red
)

