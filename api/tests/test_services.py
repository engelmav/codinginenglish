import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from api.database.providers import base_provider
from database.handlers import init_db
from database.models import model_factory
from api.services.cie import UserService, ModuleService


def test_user_registered_modules():
    engine = create_engine('sqlite:///:memory:', echo=True)
    sqlite_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
    base_provider.configure_custom_base(sqlite_session)
    CustomBase = base_provider.get_base()
    models = model_factory(CustomBase)
    init_db(CustomBase, engine)

    module_name = "Web App Development - Intermediate"
    module_data = {
        "name": module_name,
        "description": "some description."}
    module_service = ModuleService(models)
    created_module = module_service.create_module(**module_data)
    now = datetime.datetime.now()
    created_session = models.ModuleSession(cie_module_id=created_module.id, session_datetime=now)
    created_session.add()
    user_service = UserService(models)

    user = user_service.create_user("some.email@email.com",
                                    first_name="FakeFirst",
                                    last_name="FakeLast")

    user_ = models.User.query.filter_by(id=user.id).one()
    user_.add_to_module_session(created_session)
    registered_modules = user_service.registered_modules(user.id)
    print(registered_modules)
    assert registered_modules[0].module_name == module_name
