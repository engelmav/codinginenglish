from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.pool import QueuePool

import pymysql
import logging

from config import config


LOG = logging.getLogger(__name__)
db_password = config["cie.database.password"]
db_host = config["cie.database.host"]


def get_conn():
    cnx = None
    try:
        cnx = pymysql.connect(
            user="appuser",
            password=db_password,
            host=db_host,
            port=3306,
            database="cie")
    except Exception:
        LOG.error("Could not connect to database. See exception below.", exc_info=True)
    return cnx


pool = QueuePool(
    creator=get_conn,
    pool_size=36,      # workercount * pool_size must be < MySQL max_connections
    max_overflow=0,    # allows you to go higher than pool_size allowed
    timeout=20,        # seconds before giving up acquiring a connection from pool
    recycle=299)       # refresh the pool ever 299 seconds


engine = create_engine('mysql+pymysql://', pool=pool)
mysql_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))


