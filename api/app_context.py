import redis
from simplekv.memory.redisstore import RedisStore

from config import config

redis_pw = config["cie.redis.password"]
redis_host = config["cie.redis.host"]
red = redis.StrictRedis(host=redis_host, password=redis_pw, port=6379)
redis_store = RedisStore(red)

