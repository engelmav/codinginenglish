from sqlalchemy.pool import Pool
from sqlalchemy import exc, event


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


def init_db(Base, engine):
    Base.metadata.create_all(bind=engine)
