from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.pool import QueuePool, Pool
from sqlalchemy import exc, event
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
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))


@event.listens_for(Pool, "checkout")
def on_conn_checkout(dbapi_con, _arg1, _arg2):
    """
    This is a manual version of pessimistic connection ping. Necessary for mysql.
    http://docs.sqlalchemy.org/en/rel_0_8/core/pooling.html#disconnect-handling-pessimistic
    """
    cursor = dbapi_con.cursor()
    try:
        cursor.execute("SELECT 1") # dbapi_con.ping() equivalent
    except exc.OperationalError as ex:
        if ex.args[0] in (2006,   # MySQL server has gone away
                          2013,   # Lost connection to MySQL server during query
                          2055):  # Lost connection to MySQL server at '%s', system error: %d
            raise exc.DisconnectionError()
        else:
            raise


class CustomBase(object):
    session = db_session
    query = db_session.query_property()

    def add(self):
        db_session.add(self)
        self._commit()

    def _commit(self):
        db_session.commit()


Base = declarative_base(cls=CustomBase)


def init_db():
    import database.models
    Base.metadata.create_all(bind=engine)
