from database.models import User, CieModule


def test_add_user():
    user = User(firstname='Francesco', lastname='Saudino')
    user.add()


def test_add_module():
    mod = CieModule(
        name="Cie Module Creation Test"
    )
    mod.add()


def test_add_user_to_module():
    ...


def test_get_modules():
    all = CieModule.query.all()
    print(all)

def test_add_module_to_user():
    pass
