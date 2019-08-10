from database.models import User
from database.database import db_session


def test_add_user():
    user = User(firstname='Francesco', lastname='Saudino')
    user.add()



def test_add_module_to_user():
    pass
