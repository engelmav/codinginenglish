from database.models import User, CieModule
from endpoints import app

test_client = app.test_client()


def test_add_user():
    user = User(firstname='Francesco', lastname='Saudino')
    user.add()


def test_add_module():
    mod_name = "Cie Module Creation Test"
    mod = CieModule(
        name=mod_name
    )
    mod.add()
    m = CieModule.query.filter(CieModule.name == mod_name).one()
    assert m.name == mod_name


def test_add_user_to_module():
    user = User(firstname='Test', lastname='User')
    user.add()
    mod_name = "Test Module - Add User"
    mod = CieModule(
        description="Test Desc",
        name=mod_name
    )
    mod.add()
    m = CieModule.query.filter(CieModule.name == mod_name).one()
    m.add_user(user)


def test_get_modules():
    all = CieModule.query.all()
    print(all)


def test_get_modules_endpoint():
    mod_name = "Cie Module Creation Test"
    mod = CieModule(
        name=mod_name,
        description="Test Desc"
    )
    mod.add()
    res = test_client.get('/modules').json
    print(res)


def test_add_module_to_user():
    pass
