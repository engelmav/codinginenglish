import pytz
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.dialects.mysql.json import JSON
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship


class Models:
    def __init__(self,
                 _CieModule,
                 _ModuleSession,
                 _UserModuleRegistration,
                 _User,
                 _ActiveSession,
                 _UserActiveSession,
                 _AulaConfig,
                 _StudentApplication):
        self.CieModule = _CieModule
        self.ModuleSession = _ModuleSession
        self.UserModuleRegistration = _UserModuleRegistration
        self.User = _User
        self.ActiveSession = _ActiveSession
        self.UserActiveSession = _UserActiveSession
        self.AulaConfig = _AulaConfig
        self.StudentApplication = _StudentApplication


def model_factory(Base):
    class CieModule(Base):
        __tablename__ = 'cie_modules'
        __table_args__ = {'extend_existing': True}
        id = Column(Integer, primary_key=True)
        name = Column(String(50))
        description = Column(String(255))
        image_path = Column(String(255))
        module_sessions = relationship("ModuleSession", back_populates="cie_module")

        def add_user(self, user: 'User', session: 'ModuleSession'):
            reg = UserModuleRegistration(user_id=user.id, module_session_id=session.id)
            reg.add()

    class ModuleSession(Base):
        __tablename__ = 'module_sessions'
        id = Column(Integer, primary_key=True)
        cie_module_id = Column(Integer, ForeignKey('cie_modules.id'))
        # https://stackoverflow.com/a/55570422/1258020
        cie_module = relationship(
            'CieModule',
            back_populates='module_sessions'
        )
        _session_datetime = Column("session_datetime", DateTime)

        @hybrid_property
        def session_datetime(self):
            return pytz.utc.localize(self._session_datetime)
        
        @session_datetime.expression
        def session_datetime(cls):
            return cls._session_datetime

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
        firstname = Column(String(50))
        lastname = Column(String(50))
        fullname = Column(String(120))
        email = Column(String(120), unique=True)
        rocketchat_id = Column(Text)
        nickname = Column(Text)
        status = Column(String(100))
        # TODO: add nickname
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
        __tablename__ = 'active_sessions'
        id = Column(Integer, primary_key=True)
        module_session_id = Column(Integer, ForeignKey('module_sessions.id'))
        chat_channel = Column(Text)
        prezzie_link = Column(Text)
        video_channel = Column(Text)
        slug = Column(Text)
        is_active = Column(Boolean)

    class UserActiveSession(Base):
        __tablename__ = 'user_active_sessions'
        id = Column(Integer, primary_key=True)
        user_id = Column(Integer, ForeignKey('users.id'))
        active_session_id = Column(Integer, ForeignKey('active_sessions.id'))
        active_session = relationship('ActiveSession')

    class AulaConfig(Base):
        __tablename__ = 'aula_config'
        id = Column(Integer, primary_key=True)
        active_session_id = Column(Integer, ForeignKey('active_sessions.id'))
        config = Column(JSON)

    class StudentApplication(Base):
        __tablename__ = 'student_applications'
        id = Column(Integer, primary_key=True)
        app = Column(JSON)

    models = Models(
        CieModule,
        ModuleSession,
        UserModuleRegistration,
        User,
        ActiveSession,
        UserActiveSession,
        AulaConfig,
        StudentApplication)
    return models








