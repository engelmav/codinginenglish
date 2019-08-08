from database.models import User
from database.database import db_session



def test_add_user():
    user = User(firstname='Francescol', lastname='Saudino')
    # db_session.add(user)
    user.add()
    # db_session.commit()
    # db_session.remove()


def test_add_module_to_user():
    pass