from falcon import testing
from models import User
import pytest

from api import api


TEST_USER = "Emiliano"


@pytest.fixture(autouse=True)
def delete_test_user():
    yield
    User.delete().where(User.first_name == TEST_USER).execute()



@pytest.fixture
def client():
    return testing.TestClient(api)


def test_get_user(client):
    user = {
        "name": "Emiliano Russo"
    }

    response = client.simulate_get('/students')
    print(response)


def test_db():
    from datetime import datetime

    now = datetime.now()

    emiliano = User(first_name=TEST_USER, last_name="Russo", created_date=now)
    saved_id = emiliano.save()
    assert saved_id == 1
