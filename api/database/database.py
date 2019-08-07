from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from config import config


db_password = config["cie.database.password"]
engine = create_engine(f'mysql+pymysql://appuser:{db_password}@localhost/cie', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    import database.models
    Base.metadata.create_all(bind=engine)
