from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from config import config


db_password = config["cie.database.password"]
engine = create_engine(f'mysql+pymysql://appuser:{db_password}@cie-db/cie')
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))


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
