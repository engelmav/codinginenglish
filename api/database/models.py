import pytz
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship


class Models:
    def __init__(self,
                 _CieModule,
                 _ModuleSession,
                 _UserModuleRegistration,
                 _User,
                 _ActiveSession):
        self.CieModule = _CieModule
        self.ModuleSession = _ModuleSession
        self.UserModuleRegistration = _UserModuleRegistration
        self.User = _User
        self.ActiveSession = _ActiveSession


def model_factory(Base):
    class CieModule(Base):
        __tablename__ = 'cie_modules'
        __table_args__ = {'extend_existing': True}
        id = Column(Integer, primary_key=True)
        name = Column(String(50))
        description = Column(String(255))
        image_path = Column(String(255))

        def add_user(self, user: 'User', session: 'ModuleSession'):
            reg = UserModuleRegistration(user_id=user.id, module_session_id=session.id)
            reg.add()

    class ModuleSession(Base):
        __tablename__ = 'module_sessions'
        id = Column(Integer, primary_key=True)
        cie_module_id = Column(Integer, ForeignKey('cie_modules.id'))
        cie_module = relationship(
            'CieModule',
            backref='ModuleSession'
        )
        _session_datetime = Column("session_datetime", DateTime)

        @property
        def session_datetime(self):
            return pytz.utc.localize(self._session_datetime)

        @session_datetime.setter
        def session_datetime(self, session_dt):
            self._session_datetime = session_dt

    class UserModuleRegistration(Base):
        __tablename__ = 'user_module_registration'
        id = Column(Integer, primary_key=True)
        user_id = Column(Integer, ForeignKey('users.id'))
        module_session_id = Column(Integer, ForeignKey('module_sessions.id'))
        module_session = relationship("ModuleSession")

    class User(Base):
        __tablename__ = 'users'
        id = Column(Integer, primary_key=True)
        firstname: Column = Column(String(50))
        lastname = Column(String(50))
        fullname = Column(String(120))
        email = Column(String(120), unique=True)
        registered_modules = relationship(
            'UserModuleRegistration',
            backref='User',
            cascade='all, delete, delete-orphan'
        )

        def add_to_module_session(self, module_session: 'ModuleSession') -> UserModuleRegistration:
            user_mod_reg = UserModuleRegistration(user_id=self.id, module_session_id=module_session.id)
            user_mod_reg.add()
            return user_mod_reg

    class ActiveSession(Base):
        __tablename__ = 'current_sessions'
        id = Column(Integer, primary_key=True)
        module_session_id = Column(Integer, ForeignKey('module_sessions.id'))
        user_id = Column(Integer, ForeignKey('users.id'))

    models = Models(
        CieModule,
        ModuleSession,
        UserModuleRegistration,
        User,
        ActiveSession)
    return models








