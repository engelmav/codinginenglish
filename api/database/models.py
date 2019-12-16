from database.database import Base, db_session
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from marshmallow_sqlalchemy import ModelSchema
from marshmallow.fields import Nested
from marshmallow import post_load


class UserModuleRegistration(Base):
    __tablename__ = 'user_module_registration'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    module_session_id = Column(Integer, ForeignKey('module_sessions.id'))


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    firstname = Column(String(50))
    lastname = Column(String(50))
    email = Column(String(120), unique=True)
    registered_modules = relationship(
        'UserModuleRegistration',
        backref='User',
        cascade='all, delete, delete-orphan'
    )

    def add_to_mod(self, cie_module: 'CieModule'):
        user_mod_reg = UserModuleRegistration(user_id=self.id, cie_module_id=cie_module.id)
        user_mod_reg.add()


class UserSchema(ModelSchema):
    class Meta:
        model = User
        sqla_session = db_session


class CieModule(Base):
    __tablename__ = 'cie_modules'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    description = Column(String(255))
    image_path = Column(String(255))

    def add_user(self, user: User, session: 'ModuleSession'):
        reg = UserModuleRegistration(user_id=user.id, module_session_id=session.id)
        reg.add()


class CieModuleSchema(ModelSchema):
    class Meta:
        model = CieModule
        sqla_session = db_session

    @post_load
    def make_cie_module(self, data, **kwargs):
        return CieModule(**data)


class ModuleSession(Base):
    __tablename__ = 'module_sessions'
    id = Column(Integer, primary_key=True)
    cie_module_id = Column(Integer, ForeignKey('cie_modules.id'))
    cie_module = relationship(
        'CieModule',
        backref='ModuleSession'
    )
    session_datetime = Column(DateTime)


class SmartNested(Nested):
    def serialize(self, attr, obj, accessor=None):
        if attr not in obj.__dict__:
            return {"id": int(getattr(obj, attr + "_id"))}
        return super(SmartNested, self).serialize(attr, obj, accessor)


class ModuleSessionSchema(ModelSchema):
    # cie_module = SmartNested(CieModuleSchema)
    cie_module = Nested(CieModuleSchema())

    class Meta:
        model = ModuleSession
        sqla_session = db_session




