from sqlalchemy.ext.declarative import declarative_base


class SessionProvider:
    def __init__(self):
        self.session = None

    def set_session(self, session):
        self.session = session

    def get_session(self):
        if self.session is None:
            raise Exception("Call `session_provider.set_session(session)`"
                            "prior to get_session()")
        return self.session


class BaseProvider:
    def __init__(self):
        self.Base = None

    def configure_custom_base(self, db_session):
        class CustomBase(object):
            session = db_session
            query = db_session.query_property()

            def add(self):
                db_session.add(self)
                self.commit()

            def commit(self):
                db_session.commit()

        self.Base = declarative_base(cls=CustomBase)

    def get_base(self):
        if self.Base is None:
            raise Exception("You must first configure your SQLAlchemy base by calling"
                            "`base_provider.configure_custom_base(session)`")
        return self.Base


base_provider = BaseProvider()
db_session_provider = SessionProvider()
