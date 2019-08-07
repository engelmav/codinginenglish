from marshmallow_sqlalchemy import ModelSchema
from database.models import User
from database.database import db_session


class UserSchema(ModelSchema):
    class Meta:
        model = User
        sqla_session = db_session
