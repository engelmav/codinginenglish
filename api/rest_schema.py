from marshmallow import post_load
from marshmallow.fields import Nested
from marshmallow_sqlalchemy import ModelSchema, auto_field




class Schema:
    def __init__(self,
                 _UserSchema,
                 _CieModuleSchema,
                 _ModuleSessionSchema,
                 _UserModuleRegistrationSchema,
                 _ActiveSessionSchema,
                 _UserActiveSessionSchema,
                 _AulaConfigSchema):
        self.UserSchema = _UserSchema
        self.CieModuleSchema = _CieModuleSchema
        self.ModuleSessionSchema = _ModuleSessionSchema
        self.UserModuleRegistrationSchema = _UserModuleRegistrationSchema
        self.ActiveSessionSchema = _ActiveSessionSchema
        self.UserActiveSessionSchema = _UserActiveSessionSchema
        self.AulaConfigSchema = _AulaConfigSchema


def schema_factory(db_session, models):
    """
    This function compensates for the module-level declarative implementation of
    marshmallow model schema and a desire to use it with dependency injection.
    :param db_session:
    :param models:
    :return:
    """
    class CieModuleSchema(ModelSchema):
        module_sessions = Nested("ModuleSessionSchema", many=True, exclude=("cie_module",))

        class Meta:
            model = models.CieModule
            sqla_session = db_session

        @post_load
        def make_cie_module(self, data):
            return models.CieModule(**data)

    class ModuleSessionSchema(ModelSchema):
        cie_module = Nested(CieModuleSchema)
        # I don't remember why "registered_modules" is here but it doesn't look right.
        registered_modules = Nested(CieModuleSchema())

        class Meta:
            model = models.ModuleSession
            sqla_session = db_session

    class UserModuleRegistrationSchema(ModelSchema):

        # This strangely produces an extra `User: <id>` field in the serialized JSON.
        class Meta:
            include_fk = True
            model = models.UserModuleRegistration
            sqla_session = db_session

    class UserSchema(ModelSchema):
        cie_module = Nested(CieModuleSchema())

        class Meta:
            model = models.User
            sqla_session = db_session

    class ActiveSessionSchema(ModelSchema):
        class Meta:
            model = models.ActiveSession
            sqla_session = db_session

    class UserActiveSessionSchema(ModelSchema):
        class Meta:
            include_fk = True
            model = models.UserActiveSession
            sqla_session = db_session

    class AulaConfigSchema(ModelSchema):
        class Meta:
            model = models.AulaConfig
            sqla_session = db_session

    schema = Schema(
        UserSchema,
        CieModuleSchema,
        ModuleSessionSchema,
        UserModuleRegistrationSchema,
        ActiveSessionSchema,
        UserActiveSessionSchema,
        AulaConfigSchema
    )
    return schema


class SmartNested(Nested):
    def serialize(self, attr, obj, accessor=None):
        if attr not in obj.__dict__:
            return {"id": int(getattr(obj, attr + "_id"))}
        return super(SmartNested, self).serialize(attr, obj, accessor)
