from database.models import User, CieModule, ModuleSession

from endpoints import app

from datetime import datetime


test_client = app.test_client()


def _create_module(name):
    mod = CieModule(
        name=name
    )
    mod.add()
    return mod


def test_add_user(yo):
    user = User(firstname='Francesco', lastname='Saudino')
    user.add()


def test_add_module():
    mod_name = "Cie Module Creation Test"
    _create_module(mod_name)
    m = CieModule.query.filter(CieModule.name == mod_name).one()
    assert m.name == mod_name


def test_create_module_endpoint():
    res = test_client.post('/modules', json=
        [
            {
                "name": "value",
                "description": "value"
            }
        ]
    )
    assert res.json['name'] == 'value'


def test_add_user_to_module():
    user = User(firstname='Test', lastname='User')
    user.add()
    mod_name = "Test Module - Add User"
    _create_module(mod_name)
    m = CieModule.query.filter(CieModule.name == mod_name).one()
    sess = ModuleSession(cie_module_id=m.id, session_datetime=datetime(2015, 6, 5, 8, 10, 10, 10))
    sess.add()
    m.add_user(user, sess)


def test_add_user_to_module_endpoint():
    ...


def test_get_modules():
    all = CieModule.query.all()
    print(all)


def test_get_all_module_sessions():
    all = ModuleSession.query.all()
    print(all)


def test_get_all_module_sessions_endpoint():
    res = test_client.get('/module-sessions').json
    print(res)


def test_get_modules_endpoint():
    mod_name = "Cie Module Creation Test"
    _create_module(mod_name)
    res = test_client.get('/modules').json



