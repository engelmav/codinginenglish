from database.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    firstname = Column(String(50))
    lastname = Column(String(50))
    email = Column(String(120), unique=True)
    registered_modules = db.re


class CieModule(Base):
    __tablename__ = 'cie_modules'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))


class UserModRegistration(Base):
    __table_name = 'user_module_registration'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    cie_module_id = Column(Integer, ForeignKey('cie_modules.id'))

    user = relationship("User", foreign_keys=[user_id])
    cie_modules = relationship("User", foreign_keys=[cie_module_id])
