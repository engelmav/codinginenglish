from database.database import Base, db_session
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from marshmallow_sqlalchemy import ModelSchema


class UserModRegistration(Base):
    __tablename__ = 'user_module_registration'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    cie_module_id = Column(Integer, ForeignKey('cie_modules.id'))

    # user = relationship("User", foreign_keys=[user_id])
    # cie_modules = relationship("User", foreign_keys=[cie_module_id])

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    firstname = Column(String(50))
    lastname = Column(String(50))
    email = Column(String(120), unique=True)
    registered_modules = relationship(
        'UserModRegistration',
        backref='User',
        cascade='all, delete, delete-orphan'
    )


class UserSchema(ModelSchema):
    class Meta:
        model = User
        sqla_session = db_session


class CieModule(Base):
    __tablename__ = 'cie_modules'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    registered_users = relationship(
        'UserModRegistration',
        backref='CieModule',
        cascade='all, delete, delete-orphan',
    )
