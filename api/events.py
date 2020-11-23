import threading
from time import sleep

import redis
from simplekv.memory.redisstore import RedisStore

from config import config


redis_pw = config["cie.redis.password"]
redis_host = config["cie.redis.host"]
red = redis.StrictRedis(host=redis_host, password=redis_pw, port=6379)
redis_store = RedisStore(red)


def pub_to_redis(command_str):
    res = red.publish('cie', command_str)
    return res


def session_start_poll(callback):
    """
    Polls for a class session that will start to notify frontend.
    :param callback:
    :return: Thread.
    """
    def session_poll():
        while True:
            # select
            print("polling")
            sleep(2)
            callback("{ \"class_in_session\": true }")
    t = threading.Thread(name='session-poll', target=session_poll, daemon=True)
    return t.start()

