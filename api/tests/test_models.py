from fixtures import make_models, make_datetime_5_min_ago
from services.cie import ModuleService, UserService


def test_active_session():
    models = make_models()
    module = models.CieModule(name="Test Module Name", description="desc", image_path="/")
    module.add()

    five_min_ago = make_datetime_5_min_ago()
    created_session = models.ModuleSession(cie_module_id=module.id, session_datetime=five_min_ago)
    created_session.add()

    module_service = ModuleService(models)

    mod_session_id = created_session.id
    module_session_sqla = module_service.get_module_session_by_id(mod_session_id)

    user_service = UserService(models)
    user = user_service.create_user("some.email@email.com",
                                    first_name="FakeFirst",
                                    last_name="FakeLast")

    user = models.User.query.filter_by(id=user.id).one()
    user_reg = user.add_to_module_session(module_session_sqla)
    active_session = models.ActiveSession(
        user_id=user_reg.id,
        module_session_id=user_reg.module_session_id
    )
    active_session.add()
    assert active_session.id == 1
